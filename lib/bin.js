module.exports = {};

var DEFAULT_GAS = 1000000;

var program = require('commander');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var setup = require('./setup');
var miner = require('./miner');
var keystore = require('./keystore');
var balance = require('./balance');
var Signer = require('./signer');
var transfer = require('./transfer');
var deploy = require('./contract-deployer');
var HookedWeb3Provider = require("hooked-web3-provider");
var Web3 = require('web3');
var dataDir, /* ipcPath, */ rpcEndpoint, provider, defaultDataDir = false;

function collect(val, memo) {
  if (!isNaN(parseFloat(val))) {
    val = parseFloat(val);
  }
  memo.push(val);
  return memo;
}

program
  .option('')
  .option('--datadir <path>',         'specify ethereum datadir (default $HOME/.huff or env HUFF_DATADIR)')
  .option('--rpcaddr <addr>',         'specifiy rpc ip address (default localhost')
  .option('--rpcport <addr>',         'specifiy rpc port (default 8545')
  .option('--reset',                  'destroy/create private net at <datadir> (BEWARE, it deletes)')
  .option('-m, --mine',               'start geth server/miner on <datadir>')
  .option('--create-account',         'create new account <datatdir>>/keystore')
  .option('--list-accounts',          'list accounts in  <datatdir>>/keystore')
  .option('--show-key <address/seq>', 'show account\'s privateKey')
  .option('--balance <address/seq>',  'show account\'s balance in wei')
  .option('--sender <address/seq>',   '"from" account for transactions/contract deployments (default 0)')
  .option('--to <address/seq>',       '"to" account for transfers')
  .option('--transfer <value>',       'transfer value in ether from <sender> to <to>')
  .option('--wei',                    'use wei instead of ether as unit for transfer and balance')
  .option('--gas <amount>',           'gas limit for transactions/contract deployments')
  .option('--deploy <contractFile>',  'deploy contract specifying source file')
  .option('-p, --param <value>',      'parameters for contract (deploy) constructor', collect, [])
  .option('',                         'can be repeated: -p 1 -p 2 -p 3')
  ;

program.parse(process.argv);

if (process.env.HUFF_DATADIR) {
  dataDir = process.env.HUFF_DATADIR;
  defaultDataDir = true;
} else if (program.datadir) {
  dataDir = program.datadir;
} else {
  dataDir = process.env.HOME + '/.huff'
  defaultDataDir = true;
}

if (typeof program.rpcaddr === 'undefined') {
  program.rpcaddr = '127.0.0.1';
}

if (typeof program.rpcport === 'undefined') {
  program.rpcport = 8545;
}

rpcEndpoint = 'http://' + program.rpcaddr + ':' + program.rpcport;

if (program.reset) {
  try {
    rimraf.sync(dataDir);
    return setup({dataDir: dataDir})
      .catch(function(error) {
        console.error(error);
        process.exit(1);
      });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function validate() {
  try {
    fs.lstatSync(dataDir);
    fs.lstatSync(dataDir + path.sep + 'keystore');
  } catch (e) {
    console.error('...missing datadir %s', dataDir);
    console.log('\nBuild a private network there as follows\n');
    if (defaultDataDir) {
      console.log('  huff --reset');
    } else {
      console.log('  huff --reset --datadir "%s"', dataDir);
    }
    console.log();
    process.exit(1);
  }
}

function errorHandle(error) {
  console.error(error);
  disconnect();
  process.exit(1);
}

function connect() {
  // TODO: make this fail on ipc not listening (perhap also compare ipc versions)
  // ipcPath = path.normalize(dataDir + path.sep + 'geth.ipc');
  // provider = new Web3.providers.IpcProvider(ipcPath, require('net'));

  var provider = new HookedWeb3Provider({
    host: rpcEndpoint,
    transaction_signer: new Signer({
      dataDir: dataDir
    })
  });

  global.web3 = new Web3(provider);
}

function disconnect() {
  if (provider) {
    provider.connection.end();
  }
}

if (program.mine) {
  validate();
  return miner.start({
    dataDir: dataDir,
    rpcAddr: program.rpcaddr,
    rpcPort: program.rpcport
  });
}


else if (program.showKey) {
  validate();
  return keystore.showKey({
    dataDir: dataDir,
    address: program.showKey
  }).then(function(privateKey) {
    console.log('\nPrivateKey:', privateKey);
  }).catch(errorHandle);
}

else if (program.createAccount) {
  validate();
  return keystore.createAccount({
    dataDir: dataDir
  }).then(function(account) {
    console.log('\nAccount:', account);
  }).catch(errorHandle)
}


else if (program.listAccounts) {
  validate();
  connect();
  return keystore.listAccounts({
    dataDir: dataDir
  }).then(function(accounts) {
    accounts.forEach(function(account, i) {
      if (program.wei) {
        console.log('%d: %s wei: %s',i, account.Address, account.Balance.toString(10));
      } else {
        console.log('%d: %s ether: %s',i, account.Address, web3.fromWei(account.Balance, 'ether').toString(10));
      }
    });
    disconnect();
  }).catch(errorHandle)
}

else if (program.balance) {
  validate();
  connect();
  return balance({
    dataDir: dataDir,
    address: program.balance
  }).then(function(balance){
    if (program.wei) {
      console.log('wei: %s', balance.toString(10));
    } else {
      console.log('ether: %s', web3.fromWei(balance, 'ether').toString(10));
    }
    disconnect();
  }).catch(errorHandle)
}

else if (program.transfer) {
  validate();
  connect();
  return transfer({
    dataDir: dataDir,
    sender: program.sender,
    value: program.transfer,
    to: program.to,
    wei: program.wei,
    gas: program.gas || DEFAULT_GAS
  }).then(function(){
    disconnect();
  }).catch(errorHandle)
}

else if (program.deploy) {
  validate();
  connect();
  return deploy({
    dataDir: dataDir,
    sender: program.sender,
    params: program.param,
    file: program.deploy,
    gas: program.gas || DEFAULT_GAS
  }).then(function(){
    disconnect();
  }).catch(errorHandle)
}

else {
  program.help();
  proccess.exit(1);
}



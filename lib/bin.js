module.exports = {};

var program = require('commander');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var setup = require('./setup');
var miner = require('./miner');
var keystore = require('./keystore');
var balance = require('./balance');
var Web3 = require('web3');
var dataDir, ipcPath, provider, defaultDataDir = false;


program
  .option('')
  .option('--datadir <path>',         'specify ethereum datadir,')
  .option('',                         'defaults to $HOME/.huff')
  .option('',                         'env HUFF_DATADIR overrides')
  .option('')
  .option('--reset',                  're-create (or create) private net at <datadir>')
  .option('',                         'BEWARE: it destroys what is there!')
  .option('')
  .option('-m, --mine',               'start geth server/miner on <datadir>')
  .option('',                         'requires wallet (mist) to not be running')
  .option('',                         'or to be started afterwards')
  .option('')
  .option('--create-account',         'create new account <datatdir>>/keystore')
  .option('--list-accounts',          'list accounts')
  .option('--show-key <address/seq>', 'show account\'s privateKey')
  .option('--balance <address/seq>',  'show account\'s balance in wei')
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
  ipcPath = path.normalize(dataDir + path.sep + 'geth.ipc');
  provider = new Web3.providers.IpcProvider(ipcPath, require('net'));
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
    dataDir: dataDir
  });
}


if (program.showKey) {
  validate();
  return keystore.showKey({
    dataDir: dataDir,
    address: program.showKey
  }).then(function(privateKey) {
    console.log('\nPrivateKey:', privateKey);
  }).catch(errorHandle);
}

if (program.createAccount) {
  validate();
  return keystore.createAccount({
    dataDir: dataDir
  }).then(function(account) {
    console.log('\nAccount:', account);
  }).catch(errorHandle)
}


if (program.listAccounts) {
  validate();
  connect();
  return keystore.listAccounts({
    dataDir: dataDir
  }).then(function(accounts) {
    accounts.forEach(function(account, i) {
      console.log('%d: %s wei: %s',i, account.Address, account.Balance.toString(10));
    });
    disconnect();
  }).catch(errorHandle)
}

if (program.balance) {
  validate();
  connect();
  return balance({
    dataDir: dataDir,
    address: program.balance
  }).then(function(balance){
    console.log('wei: %s', balance.toString(10));
    disconnect();
  }).catch(errorHandle)
}

else {
  program.help();
  proccess.exit(1);
}

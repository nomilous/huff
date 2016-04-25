module.exports = {};

var program = require('commander');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var setup = require('./setup');
var miner = require('./miner');
var keystore = require('./keystore');
var dataDir, defaultDataDir = false;

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

if (program.mine) {
  validate();
  return miner.start({
    dataDir: dataDir
  });
}
else if (program.showKey) {
  validate();
  return keystore.showKey({
    dataDir: dataDir,
    address: program.showKey
  }).then(function(privateKey) {
    console.log('\nPrivateKey:', privateKey);
  }).catch(function(error) {
    console.error(error);
    process.exit(1);
  });
}
else if (program.createAccount) {
  validate();
  return keystore.createAccount({
    dataDir: dataDir
  }).then(function(account) {
    console.log('\nAccount:', account);
  }).catch(function(error) {
    console.log(error);
    process.exit(1);
  })
}
else if (program.listAccounts) {
  validate();
  return keystore.listAccounts({
    dataDir: dataDir
  }).then(function(accounts) {
    accounts.forEach(function(account, i) {
      console.log('%d: %s',i, account);
    })
  }).catch(function(error) {
    console.log(error);
    process.exit(1);
  })
} else {
  program.help();
  proccess.exit(1);
}



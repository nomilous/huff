module.exports = {};

var program = require('commander');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var setup = require('./setup');
var miner = require('./miner');
var keystore = require('./keystore');
var dataDir;

program
  .option('')
  .option('--datadir <path>', 'specify ethereum datadir,')
  .option('',                     'defaults to $HOME/.huff')
  .option('',                     'env HUFF_DATADIR overrides')
  .option('')
  .option('--reset',              're-create (or create) private net at <datadir>')
  .option('',                     'BEWARE: it destroys what is there!')
  .option('')
  .option('-m, --mine',          'start geth server/miner on <datadir>')
  .option('',                     'requires wallet (mist) to not be running')
  .option('',                     'or to be started afterwards')
  .option('')
  .option('--showKey [address]',  'show privateKey from keystore for address/seq')
  .option('--createAccount',      'create new account into keystore')


program.parse(process.argv);

if (process.env.HUFF_DATADIR) {
  dataDir = process.env.HUFF_DATADIR;
} else if (program.datadir) {
  dataDir = program.datadir;
} else {
  dataDir = process.env.HOME + '/.huff'
}

if (program.reset) {
  try {
    rimraf.sync(dataDir);
  } catch (e) {
    console.log(e);
  }
}


try {
  fs.lstatSync(dataDir);
  fs.lstatSync(dataDir + path.sep + 'keystore');
  command();
} catch (e) {
  return setup({dataDir: dataDir})
    .then(command)
    .catch(function(error) {
      console.error(error);
      process.exit(1);
    })
}

function command() {
  if (program.mine) {
    return miner.start({
      dataDir: dataDir
    });
  }
  else if (program.showKey) {
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
    return keystore.createAccount({
      dataDir: dataDir
    }).then(function(account) {
      console.log('\nAccount:', account);
    }).catch(function(error) {
      console.log(error);
      process.exit(1);
    })
  }
}

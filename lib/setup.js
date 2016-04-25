var Promise = require('bluebird');
var path = require('path');
var mkdirp = require('mkdirp');
var keystore = require('./keystore');
var fs = require('fs');

module.exports = function setup(opts) {
  var dataDir = opts.dataDir;
  return new Promise(function(resolve, reject) {
    var genesisFile, genesis;

    keystoreDir = path.normalize(dataDir + path.sep + 'keystore');
    genesisFile = path.normalize(dataDir + path.sep + 'genesis.json');

    try {
      console.log('...creating dir', keystoreDir);
      mkdirp.sync(keystoreDir);
    } catch (e) {
      return reject(e);
    }

    console.log('...creating etherbase account');
    keystore.createAccount(opts)
      .then(function(address) {
        console.log('...creating genesis.json');

        genesis = {
          nonce: "0x0000000000000042",
          timestamp: "0x0",
          parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
          extraData: "0x0",
          gasLimit: "0x8000000",
          difficulty: "0x400",
          mixhash: "0x0000000000000000000000000000000000000000000000000000000000000000",
          coinbase: "0x3333333333333333333333333333333333333333",
          alloc: {}
        }
        genesis.alloc[address] = {
          balance: "1000000000000000000000000000"
        }

        fs.writeFileSync(genesisFile, JSON.stringify(genesis, null, 2))
        console.log('...wrote file %s', genesisFile);
        console.log('...created private net in %s', dataDir);
        console.log('');
        resolve();

      })
      .catch(reject);

  })
};


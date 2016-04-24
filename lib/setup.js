var Promise = require('bluebird');
var path = require('path');
var mkdirp = require('mkdirp');
var keythereum = require('keythereum');
var readline = require('readline');
var fs = require('fs');

module.exports = function setup(dataDir) {
  return new Promise(function(resolve, reject) {
    var keystoreDir, genesisFile, params, dk, rl, keyObject, address, genesis;

    keystoreDir = path.normalize(dataDir + path.sep + 'keystore');
    genesisFile = path.normalize(dataDir + path.sep + 'genesis.json');

    try {
      console.log('...creating dir', keystoreDir);
      mkdirp.sync(keystoreDir);
    } catch (e) {
      return reject(e);
    }

    try {
      console.log('...creating etherbase account');
      params = { keyBytes: 32, ivBytes: 16 };
      dk = keythereum.create(params);
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('pass phrase: ', function(password) {
        rl.close();
        keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);
        address = keyObject.address;
        keythereum.exportToFile(keyObject, keystoreDir, false);



        try {
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
        } catch (e) {
          return reject(e);
        }



      });
    } catch (e) {
      return reject(e);
    }

    resolve();
  })
};


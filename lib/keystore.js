var Promise = require('bluebird');
var keythereum = require('keythereum');
var readline = require('readline');
var path = require('path');

module.exports.showKey = function(opts) {
  var dataDir = opts.dataDir;
  var address = opts.address;
  var privateKey;
  return new Promise(function(resolve, reject) {
    keythereum.importFromFile(address, dataDir, function (keyObject) {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('pass phrase: ', function(password) {
        rl.close();
        try {
          privateKey = keythereum.recover(password, keyObject);
          resolve(privateKey.toString('hex'));
        } catch (e) {
          return reject(e);
        }
      });
    });
  });
};

module.exports.createAccount = function(opts) {
  var dataDir = opts.dataDir;
  var keystoreDir = path.normalize(dataDir + path.sep + 'keystore');
  return new Promise(function(resolve, reject) {
    var params, dk, rl, keyObject, address;
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
      try {
        keythereum.exportToFile(keyObject, keystoreDir);
        resolve(address);
      } catch (e) {
        return reject(e);
      }
    });
  });
};

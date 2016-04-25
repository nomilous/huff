var Promise = require('bluebird');
var keythereum = require('keythereum');
var path = require('path');
var fs = require('fs');
var passPhrase = require('./pass-phrase');

module.exports.showKey = function(opts) {
  var dataDir = opts.dataDir;
  var address = opts.address;
  var privateKey;
  return new Promise(function(resolve, reject) {
    keythereum.importFromFile(address, dataDir, function (keyObject) {
      passPhrase.get().then(function(password) {

        privateKey = keythereum.recover(password, keyObject);
        resolve(privateKey.toString('hex'));

      }).catch(reject);
    });
  });
};

module.exports.createAccount = function(opts) {
  var dataDir = opts.dataDir;
  var keystoreDir = path.normalize(dataDir + path.sep + 'keystore');
  return new Promise(function(resolve, reject) {
    passPhrase.getConfirmed().then(function(password) {

      var params, dk, keyObject, address;
      params = { keyBytes: 32, ivBytes: 16 };
      dk = keythereum.create(params);

      keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);
      address = keyObject.address;
      keythereum.exportToFile(keyObject, keystoreDir);
      resolve(address);

    }).catch(reject);
  });
};

module.exports.listAccounts = function(opts) {
  var dataDir = opts.dataDir;
  var keystoreDir = path.normalize(dataDir + path.sep + 'keystore');
  return new Promise(function(resolve, reject) {
    try {
      var list = fs.readdirSync(keystoreDir);
      var accounts = [];
      list.forEach(function(file) {
        if (file.match(/^UTC/)) {
          accounts.push(file.split('--')[2]);
        }
      });
      return resolve(accounts);
    } catch (e) {
      return reject(e);
    }
  });
};

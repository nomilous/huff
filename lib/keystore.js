var Promise = require('bluebird');
var keythereum = require('keythereum');
var path = require('path');
var fs = require('fs');
var passPhrase = require('./pass-phrase');
var balance = require('./balance');

module.exports.showKey = function(opts) {
  var dataDir = opts.dataDir;
  var address = opts.address;
  var password = opts.passPhrase;
  var privateKey;
  return new Promise(function(resolve, reject) {
    keythereum.importFromFile(address, dataDir, function (keyObject) {
      function resolver(password) {
        privateKey = keythereum.recover(password, keyObject);
        resolve(privateKey.toString('hex'));
      }
      if (password) return resolver(password);
      passPhrase.get().then(resolver).catch(reject);
    });
  });
};

module.exports.createAccount = function(opts) {
  var dataDir = opts.dataDir;
  var keystoreDir = path.normalize(dataDir + path.sep + 'keystore');
  return new Promise(function(resolve, reject) {

    function createAccount(password) {
      var params, dk, keyObject, address;
      params = { keyBytes: 32, ivBytes: 16 };
      dk = keythereum.create(params);
      keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);
      address = keyObject.address;
      keythereum.exportToFile(keyObject, keystoreDir);
      resolve(address);
    }

    if (opts.passPhrase) {
      return createAccount(opts.passPhrase);
    }

    passPhrase.getConfirmed().then(createAccount).catch(reject);
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
          accounts.push({
            Address: file.split('--')[2]
          });
        }
      });

      Promise.resolve(accounts).map(function(account) {
        return balance({
          dataDir: dataDir,
          address: account.Address
        }).then(function(balance) {
          account.Balance = balance;
          return account;
        })
      }).then(resolve).catch(reject);

    } catch (e) {
      return reject(e);
    }
  });
};

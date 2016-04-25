var Promise = require('bluebird');
var Account = require('./account');

module.exports = function balance(opts) {
  return new Promise(function(resolve, reject) {
    Account.getAccount(opts)
      .then(function(account) {
        web3.eth.getBalance(account.Address, function(error, balance) {
          if (error) return reject(error);
          resolve(balance);
        });
      })
      .catch(reject);
  });
};

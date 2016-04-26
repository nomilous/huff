var Promise = require('bluebird');
var account = require('./account');

module.exports = function transfer(opts) {

  return new Promise(function (resolve, reject) {
    var sender = opts.sender;
    var to = opts.to;
    var asWei = opts.wei;
    var rawValue = parseFloat(opts.value);
    var gas = opts.gas;
    var value;

    if (typeof sender === 'undefined') {
      sender = 0;
    }

    if (typeof to === 'undefined') {
      return reject(new Error('transfer requires --to'));
    }

    if (isNaN(rawValue) || rawValue.toString().length !== opts.value.toString().length) {
      return reject(new Error('transfer requires numerical value'));
    } else {
      value = web3.toWei(rawValue, opts.wei ? 'wei' : 'ether');
    }

    account.getAccount({
      dataDir: opts.dataDir,
      address: sender,
    }).then(function(_account) {
      sender = _account;
      return account.getAccount({
        dataDir: opts.dataDir,
        address: to,
      })
    }).then(function(_account) {
      to = _account;
      return Promise.promisify(web3.eth.getGasPrice)();
    }).then(function(_gasPrice) {
      web3.eth.sendTransaction({
        gasPrice: web3.toHex(_gasPrice),
        gasLimit: web3.toHex(gas),
        from: '0x' + sender.Address,
        to: '0x' + to.Address,
        value: web3.toHex(value)
      }, function(error, transactionHash) {
        if (error) return reject(error);
        console.log('...tx submitted, code:', transactionHash);
        console.log('...awaiting receipt (tx mined)');
        var count = 0;
        var filter = web3.eth.filter('latest', function() {
          count++;
          web3.eth.getTransactionReceipt(transactionHash, function(error, receipt) {
            if (error) {
              filter.stopWatching();
              return reject(error);
            }
            if (!receipt) console.log('...mined +%d block, still waiting', count);
            if (receipt || count > 50) {
              filter.stopWatching();
              if (!receipt) return reject(new Error('...gave up waiting for contract to be mined'));
              resolve(receipt);
            }
          });
        });
      });
    }).catch(reject);
  });
};

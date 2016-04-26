var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var Account = require('./account');

module.exports = function(opts) {
  return new Promise(function(resolve, reject) {
    var file = opts.file;
    var send = opts.send;
    var params = opts.params;
    // var sender = opts.sender;
    var latestDir = path.normalize(file + '.deployed' + path.sep + 'latest');
    var abiFile = latestDir + path.sep  + 'abi.json';
    var contractFile = latestDir + path.sep  + 'contract.json';
    var address, abi, contract, methodAbi;
    try {
      abi = JSON.parse(fs.readFileSync(abiFile).toString());
      address = JSON.parse(fs.readFileSync(contractFile).toString()).address;
    } catch (e) {
      return reject(e);
    }

    if (typeof send !== 'undefined') {
      methodAbi = abi.filter(function(m) {
        return m.name == send;
      })[0];

      if (methodAbi) {
        if (methodAbi.inputs.length !== params.length) {
          return reject(new Error('argument count miss-match'))
        }
        if (methodAbi.constant) {
          return runConstant(opts, abi, address, methodAbi).then(resolve).catch(reject);
        } else {
          return runTransaction(opts, abi, address, methodAbi).then(resolve).catch(reject);
        }
      } else {
        reject(new Error('no such function'));
      }
    }
  });
};

function runConstant(opts, abi, address, methodAbi) {
  return new Promise(function(resolve, reject) {
    var params = opts.params;
    var contract = web3.eth.contract(abi).at(address);
    var method = methodAbi.name;
    var outputs = methodAbi.outputs;

    params.push(function(error, result) {
      if (!Array.isArray(result)) {
        result = [result];
      }

      if (error) return reject(error);
      outputs.map(function(item, i) {
        item.value = result[i];
      });
      resolve(outputs);
    });
    contract[method].apply(contract, params);
  });
}

function runTransaction(opts, abi, address, methodAbi) {
  return new Promise(function(resolve, reject) {
    var params = opts.params;
    var contract = web3.eth.contract(abi).at(address);
    var method = methodAbi.name;
    var gas = opts.gas;
    var value = opts.value;
    var asWei = opts.wei;
    Account.getAccount({dataDir: opts.dataDir, address: opts.sender || 0})
      .then(function(account) {
        if (!account.Exists) return reject(new Error('no such account'));

        web3.eth.getGasPrice(function(error, price) {

          var rawTx = {
            from: account.Address,
            gasPrice: web3.toHex(price),
            gasLimit: web3.toHex(gas)
          };

          if (typeof opts.value !== 'undefined') {
            rawTx.value = web3.toHex(asWei ? value : web3.toWei(opts.value, 'ether'));
          }

          params.push(rawTx);
          params.push(function(error, transactionHash) {
            if (error) return reject(error);

            console.log('...tx submitted, code:', transactionHash);
            console.log('...awaiting receipt (tx mined)');
            var count = 0;
            var filter = web3.eth.filter('latest', function() {
              count++;
              web3.eth.getTransactionReceipt(transactionHash, function (error, receipt) {
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

          contract[method].apply(contract, params);
        });
      })
      .catch(reject);
  });
}

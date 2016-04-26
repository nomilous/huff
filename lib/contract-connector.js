var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

module.exports = function(opts) {
  return new Promise(function(resolve, reject) {
    var file = opts.file;
    var send = opts.send;
    var params = opts.params;
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
      if (methodAbi && methodAbi.constant) {
        return runConstant(abi, address, methodAbi, params).then(resolve).catch(reject);
      } if (methodAbi) {
        return runTransaction().then(resolve).catch(reject);
      } else {
        resolve();
      }
    }
  });
};

function runConstant(abi, address, methodAbi, params) {
  return new Promise(function(resolve, reject) {
    var contract = web3.eth.contract(abi).at(address);
    var method = methodAbi.name;
    var outputs = methodAbi.outputs;

    if (methodAbi.inputs.length !== params.length) {
      return reject(new Error('argument count miss-match'))
    };

    params.push(function(error, result) {
      if (error) return reject(error);
      outputs.map(function(item, i) {
        item.value = result[i];
      });
      resolve(outputs);
    });
    contract[method].apply(contract, params);
  });
}

function runTransaction() {
  return new Promise(function(resolve, reject) {
    console.log('TODO: runTransaction');
  });
}

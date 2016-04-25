var Promise = require('bluebird');
var construct;

module.exports.deploy = function(opts) {
  return new Promise(function (resolve, reject) {
    var sender = opts.sender;
    var compiled = opts.compiled;
    var params = opts.params;
    var gas = opts.gas;

    var Contract = web3.eth.contract(compiled.abi);
    construct(Contract, sender, params, compiled.code, gas, function(error, contract) {
      if (error) return reject(error);
      resolve(contract);
    });
  });
};

construct = function(Constract, sender, params, code, gas, callback) {
  web3.eth.getGasPrice(function(error, gasPrice) {
    if (error) return callback(error);

    var rawTx = {
      data: '0x' + code,
      from: sender.Address,
      gasLimit: web3.toHex(gas),
      gasPrice: web3.toHex(gasPrice)
    };

    var done = function(error, contract) {
      if (error) return callback(error);
      if (contract.address) {
        callback(null, contract)
      }
    };

    if (params.length === 0) {
      return Constract.new(rawTx, done);

    } else if (params.length === 1) {
      return Constract.new(params[0], rawTx, done);

    } else if (params.length === 2) {
      return Constract.new(params[0], params[1], rawTx, done);

    } else if (params.length === 3) {
      return Constract.new(params[0], params[1], params[2], rawTx, done);

    } else if (params.length === 4) {
      return Constract.new(params[0], params[1], params[2], params[3], rawTx, done);

    } else if (params.length === 5) {
      return Constract.new(params[0], params[1], params[2], params[3], params[4], rawTx, done);

    } else if (params.length === 6) {
      return Constract.new(params[0], params[1], params[2], params[3], params[4], params[5], rawTx, done);

    } else if (params.length === 7) {
      return Constract.new(params[0], params[1], params[2], params[3], params[4], params[5], params[6], rawTx, done);

    } else if (params.length === 8) {
      return Constract.new(params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], rawTx, done);

    } else if (params.length === 9) {
      return Constract.new(params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8], rawTx, done);

    } else {
      return done(new Error('too many params'))
    }
  });
};

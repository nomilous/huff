var Promise = require('bluebird');
var construct;

module.exports.deploy = function(opts) {
  return new Promise(function (resolve, reject) {
    var sender = opts.sender;
    var compiled = opts.compiled;
    var params = opts.params;
    var gas = opts.gas;

    web3.eth.getGasPrice(function(error, gasPrice) {
      if (error) return reject(error);

      var rawTx = {
        data: '0x' + compiled.code,
        from: sender.Address,
        gasLimit: web3.toHex(gas),
        gasPrice: web3.toHex(gasPrice)
      };

      var Contract = web3.eth.contract(compiled.abi);
      var args = JSON.parse(JSON.stringify(params));
      args.push(rawTx);
      args.push(function(error, contract) {
        if (error) return reject(error);
        if (contract.address) {
          resolve(contract);
        }
      });

      Contract.new.apply(Contract, args);
    });
  });
};

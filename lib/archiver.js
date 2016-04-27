var Promise = require('bluebird');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var util = require('util');

module.exports.archive = function(opts) {
  return new Promise(function(resolve, reject) {
    var compiled = opts.compiled;
    var contract = opts.contract;
    var sender = opts.sender;
    var file = opts.file;
    var tag = opts.tag;

    var archiveDir = path.normalize(file + '.deployed' + path.sep + tag);
    var dateFile = archiveDir + path.sep + 'date';
    var addressFile = archiveDir + path.sep + 'address';
    var transactionFile = archiveDir + path.sep + 'transaction';
    var senderFile = archiveDir + path.sep + 'sender';
    var codeFile = archiveDir + path.sep + 'code';
    var abiFile = archiveDir + path.sep + 'abi.json';
    var jsFile = archiveDir + path.sep + 'contract.js';

    try {
      mkdirp.sync(archiveDir);
      fs.writeFileSync(dateFile, new Date().toISOString());
      fs.writeFileSync(addressFile, contract.address);
      fs.writeFileSync(transactionFile, contract.transactionHash);
      fs.writeFileSync(senderFile, '0x' + sender.Address);
      fs.writeFileSync(codeFile, '0x' + compiled.code);
      fs.writeFileSync(abiFile, JSON.stringify(compiled.abi));
      fs.writeFileSync(jsFile, toJsFile(compiled.abi, contract.address));

      resolve(archiveDir);
    } catch (e) {
      return reject(e);
    }

    function toJsFile(abi, address) {
      return util.format(
        'var address = "%s";\nvar abi = %s;\n\nvar contract = eth.contract(abi).at(address);\n\n',
        address, JSON.stringify(abi)
      );
    }
  });
};

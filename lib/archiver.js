var Promise = require('bluebird');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var util = require('util');

module.exports.archive = function(opts) {
  return new Promise(function(resolve, reject) {
    var compiled = opts.compiled;
    var contract = opts.contract;
    var file = opts.file;

    var archiveDir = file + '.deployed';
    var latestDir = archiveDir + path.sep + 'latest';
    var previousDir = archiveDir + path.sep + 'previous';

    var dateFile = latestDir + path.sep + 'date';
    var abiFile = latestDir + path.sep + 'abi.json';
    var abiFlatFile = latestDir + path.sep + 'abiFlat.json';
    var contractFile = latestDir + path.sep + 'contract.json';
    var jsFile = latestDir + path.sep + 'contract.js';
    var js = util.format('var contract = eth.contract(%s).at(\'%s\');\n', JSON.stringify(compiled.abi), contract.address);

    try {
      mkdirp.sync(archiveDir);
      try {
        fs.lstatSync(latestDir);
        var date = fs.readFileSync(dateFile).toString();
        mkdirp.sync(previousDir);
        fs.renameSync(latestDir, archiveDir + path.sep + 'previous' + path.sep + date);
        mkdirp.sync(latestDir);
      } catch (e) {
        mkdirp.sync(latestDir);
      }

      fs.writeFileSync(dateFile, new Date().toISOString());
      fs.writeFileSync(abiFile, JSON.stringify(compiled.abi, null, 2));
      fs.writeFileSync(abiFlatFile, JSON.stringify(compiled.abi));
      fs.writeFileSync(contractFile, JSON.stringify({
        address: contract.address,
        transactionHash: contract.transactionHash
      }, null, 2));
      fs.writeFileSync(jsFile, js);

      console.log('\n...stored (%s)', latestDir);
      resolve(contract);
    } catch (e) {
      return reject(e);
    }
  });
};

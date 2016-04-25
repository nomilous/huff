var Promise = require('bluebird');
var childProcess = require('child_process');
var os = require('os');

module.exports.compile = function(contractFile) {
  return new Promise(function(resolve, reject) {

    // using commandline solc so that it can follow "imports"

    childProcess.exec('solc --bin --abi ' + contractFile, function(error, stdout, stderr) {
      if (error) return reject(error);
      if (stderr.length > 0) return reject(stderr);

      // assuming the "main" contract appears first in output

      var split = stdout.split(os.EOL);
      var code = split[3];
      var abi;
      try {
        abi = JSON.parse(split[5]);
      } catch (e) {
        return reject(new Error('bad abi json: ' + split[5]));
      }
      resolve({
        code: code,
        abi:  abi
      });
    });
  });
};

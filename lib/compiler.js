var Promise = require('bluebird');
var childProcess = require('child_process');
var os = require('os');

module.exports.compile = function(contractFile) {
  return new Promise(function(resolve, reject) {

    // using commandline solc so that it can follow "imports"

    childProcess.exec('solc --bin --abi ' + contractFile, function(error, stdout, stderr) {
      if (error) return reject(error);
      if (stderr.length > 0) return reject(stderr);

      // assuming output fom solc --bin ---abi will remain constant

      var split = stdout.split(os.EOL);

      var selectedCode = '';
      var selectedAbi;
      for (i = 1; i < split.length; ) {
        code = split[i+2];
        abi = split[i+4];
        if (code.length > selectedCode.length) {
          selectedCode = code;
          selectedAbi = JSON.parse(abi);
        }
        i += 7;
      }

      resolve({
        code: selectedCode,
        abi:  selectedAbi
      });
    });
  });
};

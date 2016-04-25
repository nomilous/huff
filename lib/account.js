var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

module.exports.getAccount = function(opts) {
  return new Promise(function(resolve, reject) {
    var seq, address, list, keystoreDir;
    keystoreDir = path.normalize(opts.dataDir + path.sep + 'keystore');
    seq = parseInt(opts.address);
    if (isNaN(seq)) {
      address = opts.address;
    } else if (seq.toString().length !== opts.address.length) {
      address = opts.address;
    } else {

      try {
        list = fs.readdirSync(keystoreDir).filter(function(file) {
          return file.match(/^UTC/);
        });

        if (typeof list[seq] ===  'undefined') {
          return reject(new Error('sequence out of range'));
        }
        address = list[seq].split('--')[2];
      } catch (e) {
        return reject(e);
      }
    }
    return resolve({
      Address: address
    });
  });
};

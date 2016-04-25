var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

var checkExists = function(keystoreDir, address) {
  var list = fs.readdirSync(keystoreDir);
  return list.filter(function(file) {
    return file.match(new RegExp(address + '$'))
  }).length == 1;
}

module.exports.getAccount = function(opts) {
  return new Promise(function(resolve, reject) {
    var seq, address, list, keystoreDir, exists;
    keystoreDir = path.normalize(opts.dataDir + path.sep + 'keystore');
    seq = parseInt(opts.address);
    if (isNaN(seq)) {
      address = opts.address;
      exists = checkExists(keystoreDir, address);
    } else if (seq.toString().length !== opts.address.toString().length) {
      address = opts.address;
      exists = checkExists(keystoreDir, address);
    } else {
      try {
        list = fs.readdirSync(keystoreDir).filter(function(file) {
          return file.match(/^UTC/);
        });

        if (typeof list[seq] ===  'undefined') {
          return reject(new Error('sequence out of range'));
        }
        address = list[seq].split('--')[2];
        exists = true;
      } catch (e) {
        return reject(e);
      }
    }
    return resolve({
      Address: address,
      Exists: exists
    });
  });
};

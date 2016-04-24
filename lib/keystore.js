var keythereum = require('keythereum');
var readline = require('readline');

module.exports.showKey = function(opts) {
  var dataDir = opts.dataDir;
  var address = opts.address;
  keythereum.importFromFile(address, dataDir, function (keyObject) {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('pass phrase: ', function(password) {
      rl.close();
      var privateKey = keythereum.recover(password, keyObject);
      console.log('PrivateKey:', privateKey.toString('hex'));
    });
  });
};



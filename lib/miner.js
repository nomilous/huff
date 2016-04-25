var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

module.exports.start = function(opts) {
  var dataDir = opts.dataDir;
  var rpcAddr = opts.rpcAddr;
  var rpcPort = opts.rpcPort;
  var genesisFile = path.normalize(dataDir + path.sep + 'genesis.json');
  var args = [
    '--identity', 'private',
    '--minerthreads', '1',
    '--mine',
    '--datadir', dataDir,
    '--nodiscover',
    '--networkid', '9999',
    '--rpc',
    '--rpcaddr', rpcAddr,
    '--rpcport', rpcPort
  ];

  try {
    fs.lstatSync(genesisFile);
    args.push('--genesis');
    args.push(genesisFile);
  } catch (e) {}

  console.log('...start mining in %s', dataDir);
  console.log('');
  console.log('geth', args.join(' '), '\n');
  setTimeout(function() {

    var child = childProcess.spawn('geth', args);

    child.stdout.on('data', function(data) {
      console._stdout.write(data.toString());
    });

    child.stderr.on('data', function(data) {
      console._stdout.write(data.toString());
    });

    process.on('SIGINT', function() {
      // geth hears this and stops
    });

  }, 2000);

};

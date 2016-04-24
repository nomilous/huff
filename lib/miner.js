var childProcess = require('child_process');

module.exports.start = function(dataDir) {
  /*
   exec geth \
   --identity private \
   --minerthreads 1 \
   --mine \
   --datadir /Users/nomilous/Library/Ethereum \
   --nodiscover \
   --networkid 9999
   */


  var child = childProcess.spawn('geth', [
    '--identity', 'private',
    '--minerthreads', '1',
    '--mine',
    '--datadir', dataDir,
    '--nodiscover',
    '--networkid', '9999'
  ])

  child.stdout.on('data', function(data) {
    console._stdout.write(data.toString());
  });

  child.stderr.on('data', function(data) {
    console._stdout.write(data.toString());
  });


  process.on('SIGINT', function() {
    // geth hears this and stops
  })

};

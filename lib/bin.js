module.exports = {};

var program = require('commander');
var miner = require('./miner');
var dataDir;

program
  .option('')
  .option('-d, --datadir <path>', 'specify ethereum datadir,')
  .option('',                     'defaults to $HOME/Library/Ethereum')
  .option('',                     'env SCINTILLA_DATADIR overrides')
  .option('')
  .option('-m, --miner',          'start geth server/miner')
  .option('',                     'requires wallet (mist) to be off')
  .option('',                     'or started afterwards')
  .option('')


program.parse(process.argv);

if (process.env.SCINTILLA_DATADIR) {
  dataDir = process.env.SCINTILLA_DATADIR;
} else if (program.datadir) {
  dataDir = program.datadir;
} else {
  dataDir = process.env.HOME + '/Library/Ethereum'
}

console.log({
  dataDir: dataDir
})

if (program.miner) {
  return miner.start(dataDir);
}

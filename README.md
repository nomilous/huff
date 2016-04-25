# huff

Commandline utility for ethereum. Perform common functions easily, including:

1. Easily create and reset private network miner.
2. Deploying contracts.
3. Calling and transacting with contracts.
4. Maintaining contract address/abi archive.
5. Wallet tools.
6. Transferring ether and viewing balances.

```bash
npm install -g scintilla
huff -h
```

Made for OSX, your paths may differ

### 1. Easily create and reset private network miner.

```bash
huff --reset [--datadir <alternative>]
```
* Destroys the network in `$HOME/.huff/*` or `<alternative>`
* Recreates it, prompting for etherbase account passphrase
* Generates `genesis.json` file.

```bash
huff --mine
```
* Start mining the new network
* Creates `$HOME/.huff/geth.ipc` for attach


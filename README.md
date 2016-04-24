# scintilla

Commandline utility for ethereum. Perform common functions easily, including:

1. Easily create and reset private chain miner.
2. Deploying contracts.
3. Calling and transacting with contracts.
4. Maintaining contract address/abi archive.
5. Wallet tools.
6. Transferring ether and viewing balances.

```bash
npm install -g scintilla
scintilla -h
```

Made for OSX, your paths may differ

### 1. Easily create and reset private chain miner.

```bash
scintilla --reset
```
* Destroys the network in `$HOME/.scintilla/*`
* Recreates it, prompting for etherbase account passphrase
* Generates `genesis.json` file.

```bash
scintilla --mine
```
* Start mining the new network
* Creates `$HOME/.scintilla/geth.ipc` for attach


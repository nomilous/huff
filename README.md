# huff

Commandline utility for ethereum. Perform common functions easily, including:

1. Easily create, run and reset private network miner.
2. Keystore tools.
3. Deploying contracts.
4. Calling and transacting with contracts.
5. Maintaining contract address/abi archive.
6. Transferring ether and viewing balances.

```bash
npm install -g huff
huff -h
```

Made for OSX, your paths may differ


### 1. Easily create, run and reset private network miner.

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


### 2. Keystore tools.

```bash
huff --create-account
```
* Creates a new account in the keystore
* Prompts for a passphrase for the new account
* Same as `geth  --datadir ~/.huff/ account new`
* BUT: Adding accounts using geth will put the account sequences out of order

```bash
huff --list-accounts
```
* List all accounts in datadir

```bash
huff --show-key <account>
huff --show-key 0
huff --show-key c10d9bbb5c9481860997e8dc5c6ada6e0ccd6f61
```
* Show account's privateKey


# huff

Commandline utility for ethereum. Perform common functions easily, including:

1. Create, run and reset private network miner.
2. Keystore tools.
3. Transferring ether and viewing balances.
4. Deploying contracts.
5. Calling and transacting with contracts.
6. Maintaining contract address/abi archive.

```bash
npm install -g huff
huff -h
```

Made for osx/linux, your paths may differ


### Create, run and reset private network miner.

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


### Keystore tools.

```bash
huff --create-account
```
* Creates a new account in the datadir/keystore
* Prompts for a passphrase for the new account
* Same as `geth  --datadir ~/.huff/ account new`
* BUT: Adding accounts using geth will put the account sequences out of order

```bash
huff --list-accounts
```
* List all accounts in datadir/keystore

```bash
huff --show-key <account>
huff --show-key 0
huff --show-key c10d9bbb5c9481860997e8dc5c6ada6e0ccd6f61
```
* Show account's privateKey


### Transferring ether and viewing balances.


# huff

Commandline utility for ethereum. Perform common functions easily, including:

1. [Create, run and reset private network miner.](https://github.com/nomilous/huff#create-run-and-reset-private-network-miner)
2. [Keystore / Account tools.](https://github.com/nomilous/huff#keystore--account-tools)
3. [Transferring ether between accounts.](https://github.com/nomilous/huff#transferring-ether-between-accounts)
4. [Deploying contracts.](https://github.com/nomilous/huff#deploying-contracts)
5. [Calling and transacting with contracts.](https://github.com/nomilous/huff#calling-and-transacting-with-contracts)

```bash
npm install -g huff
huff -h
```

Made for osx/linux, your paths may differ


### Create, run and reset private network miner.

```bash
huff --reset
huff --reset [--datadir <alternative>]
```
* Destroys the network in `$HOME/.huff/*` or `<alternative>`
* Recreates it, prompting for new etherbase account **passphrase**
* Generates `genesis.json` file.

***

```bash
huff --mine
```
* Start mining the new network
* Creates `$HOME/.huff/geth.ipc` for attach

***

### Keystore / Account tools.

```bash
huff --create-account
```
* Creates a new account in the `datadir/keystore`
* Prompts for a **passphrase** for the new account
* Same as `geth  --datadir ~/.huff/ account new`
* BUT: Adding accounts using geth will put the account sequences out of order

***

```bash
huff --list-accounts
```
* List all accounts in `datadir/keystore`
* Listing includes balance in wei

***

```bash
huff --show-key <account>
huff --show-key 0
huff --show-key c10d9bbb5c9481860997e8dc5c6ada6e0ccd6f61
```
* Show account's privateKey

***

```
huff --balance 0
huff --balance 9372fbb45a307c70f874f48a0668b512ed1ae64d
```
* Show accounts balance in wei

***

### Transferring ether between accounts.

```bash
huff --transfer 20 --to 2
```
* Transfers 20 ether from `account[0]` to `account[2]`
* Prompts for **passphrase** for `account[0]`
* Displays transaction receipt

***

```bash
huff --transfer 10 --sender 9372fbb45a307c70f874f48a0668b512ed1ae64d --to 02a82e3e3fb4e2afb01971556373fa0e03898c79
```
* Transfers 10 ether from sender address
* Prompts for **passphrase** of `9372fbb45a307c70f874f48a0668b512ed1ae64d` account

***

```bash
huff --transfer 10000000 --wei --sender 1 --to 0
```
* Transfer unit as wei instead of ether

***

### Deploying contracts

```bash
huff --deploy example/greeter.sol -p 'hello world!' [--gas 1000000]
```
* Deploys contract from source in `example/greeter.sol`
* Constructor param as 'hello world'
* Writes deployment utility files to `example/greeter.sol.deployed/latest/*` 

***

```bash
huff --sender 2 --deploy example/imagine.sol -p 'all the' -p people
```
* Supports more than one constructor parameter

***

### Calling and transacting with contracts


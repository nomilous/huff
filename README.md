# huff

Commandline utility for ethereum. For convenience.

1. [Create, Mine and Reset private network.](https://github.com/nomilous/huff#create-mine-and-reset-private-network)
2. [Keystore / Account tools.](https://github.com/nomilous/huff#keystore--account-tools)
3. [Transferring ether between accounts.](https://github.com/nomilous/huff#transferring-ether-between-accounts)
4. [Deploying contracts.](https://github.com/nomilous/huff#deploying-contracts)
5. [Calling and transacting with contracts.](https://github.com/nomilous/huff#calling-and-transacting-with-contracts)
6. [Watching contracts](https://github.com/nomilous/huff#watching-contracts)

```bash
npm install -g huff
huff -h
```

Made for osx/linux, your paths may differ

### Create, Mine and Reset private network.

***

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

***

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

***

```bash
huff --transfer 20 --to 2
```
* Transfers 20 ether from `account[0]` to `account[2]`
* Prompts for **passphrase** for `account[0]`
* Displays transaction receipt

***

```bash
huff --transfer 10 \
     --sender 9372fbb45a307c70f874f48a0668b512ed1ae64d \
     --to 02a82e3e3fb4e2afb01971556373fa0e03898c79
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

***

```bash
huff --deploy example/greeter.sol -p 'hello world!' [--gas 1000000]
```
* Deploys contract from source in `example/greeter.sol`
* Constructor param as 'hello world'
* Writes deployment state files into `example/greeter.sol.deployed/*`
* **You may want to `.gitignore *.deployed`**

***

```bash
huff --sender 2 --deploy example/imagine.sol -p 'all the' -p people
```
* Supports more than one constructor parameter

***

```bash
huff --deploy example/greeter.sol -p 'hello africa!' --tag africa
huff --deploy example/greeter.sol -p 'hello asia!' --tag asia
```
* Use optional `--tag` to deploy multiple instances of the same contract.
* Separate state files are created in `example/greeter.sol.deployed/*`
* The tag is used to distinguish between them in `--connect` and `--send` (see below)


### Calling and transacting with contracts

***

```bash
huff --connect example/greeter.sol --tag africa --send greet
```
* Runs the `greet()` method on the previously compiled contract
* Uses the utility files (as deployed) from `example/greeter.sol.deployed/latest/*` for ABI and Address
* Displays the result to console

***

```bash
huff --connect example/greeter.sol --send echo --p 'arg1' -p 'arg2'
```
* Runs `echo()` with two arguments

***

```bash
huff --connect example/greeter.sol --send kill
```
* Sends transaction to the `kill()` method

***
```bash
huff --connect token.sol --send balanceOf -p 0x9372fbb45a307c70f874f48a0668b512ed1ae64d
```

* **Precede address with '0x' when passing as parameters**

### Watching contracts

***

```bash
huff --watch example/greeter.sol
# second console
huff --connect example/greeter.sol --send update -p 'hello world'
```
* The first starts watching the contract for events.
* The second calls `update('hello world')` which emits an event

***

## TODO

* pop archive on kill()

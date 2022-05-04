# Danny Chow crypto.com interview
[backend repo](https://github.com/DannyChowGitHub/crypto-exercise-api-danny)
[frontend repo](https://github.com/DannyChowGitHub/crypto-exercise-web-danny)

## The libraries are used in this project
### Front End
**material-ui** - The React UI library

**redux-toolkit** - Redux state management for react, redux toolkit is a set of tools which maintains the states better.

### Backend
**[bip39](https://github.com/tyler-smith/go-bip39)** - A go package for generation of the seed from mnemonic words.

**[btcd/chaincfg](https://github.com/btcsuite/btcd/tree/master/chaincfg)** - A package defines chain configuration parameters for the three standard BTC networks and provides the ability for callers to define their own custom BTC networks.

**[btcd/btcutil/hdkeychain](https://github.com/btcsuite/btcd/tree/master/btcutil/hdkeychain)** - A package provides an API for bitcoin hierarchical deterministic(HD) extended keys ([BIP-0032](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)).

**[btcd/btcutil](https://github.com/btcsuite/btcd/tree/master/btcutil)** - Use it for getting the WIF private key, pay-to-pbk address and get the address hash from redeem script. But it also provides the helpful API like hash160 and more.

**[btcd/txscript](https://github.com/btcsuite/btcd/tree/master/txscript)** - Only use `MultiSigScript` function in this repo, but the package provides the APIs from the bitcoin transaction script language. Such as handing the opcode and TX in and out.

## Generate Logic Flow
### Basic
- According to the number of words, generate an entropy (between 128 and 256 bits), which is the source of randomness.

- Convert entropy to Mnemonic.[Hashing the entropy through SHA256 to get checksum and combine it with the entropy to get the corresponding words as mnemonic sentence.]

- Mnemonic to Seed.[put the mnemonic sentence through [the PBKDF2 function](https://pkg.go.dev/golang.org/x/crypto/pbkdf2). This basically hashes the mnemonic (+ optional passphrase) multiple times until it produces a final 64 byte (512 bit) result.]

- Seed to HDWallet, HDWallet to generate the extended public/private key

- Keys to addresses (Propose in BIP32 / BIP44)

### (Bonus) multi-sig
- Public key string to hex and combine as the array.
- Generate the redemption script with the txscript.MultiSigScript method.
- Generate P2SH address with the btcutil.NewAddressScriptHash method.

## Is it easy to use
Maybe yes?
The UI built in simple way, yet, the page response is effective because of lazy loading for the derivation address.

## Is it safe for users to use
Yes.
All data is generated on the page and the page does not save any data in cookies and tmp storages.

## Does it follow any practices
The Code implemented in Typescript and checked quality by eslint.

## Are there any test cases coverage
You can run below command to run test in the backend project(golang)
```
  go test ./services
```

## How to run
1. start the backend project
```
  go mod tidy && go run main.go
```

2. start the frontend project
```
  yarn && yarn start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

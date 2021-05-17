# Tatum Multi NFT

This token type represents the [Multi NFT token app](./cadence/contracts/TatumNFT.cdc) on the FLOW blockchain.

There are multiple types of NFT token series, each with distinguished sequence and admin minter account.

Tokens can be transferred only inside their token type. None of the token can have the same ID inside the same token type, but can have across them.

### Write operations

* [Setup](./cadence/transactions/setup_account.cdc) account to be able to receive NFTs
* [Add new minter role](./cadence/transactions/add_minter.cdc) for new token type - byt default, default minter account has no capabilities to mint tokens of any type
* [Mint new token](./cadence/transactions/mint.cdc) with given type and Metadata URL
* [Transfer NFT token](./cadence/transactions/transfer.cdc) inside the type between multiple recipients

### Read operations

* [Get metadata for token](./cadence/scripts/metadata.cdc) of given type and index
* [Get tokens for recipient](./cadence/scripts/token_ids_by_address.cdc) for given type

## Tests
To test the integration, please run `npm run jest`. NodeJS 12+ is required.

## Testnet tests
To perform testing on testnet, there are following steps which must be done:

* Setup account capabilities to accept TatumMultiNFT

```
flow transactions send ./cadence/transactions/setup_account.cdc --signer deployer -n testnet
flow transactions send ./cadence/transactions/setup_account.cdc --signer minter -n testnet
```

* Create new minter account for new token type

```
flow transactions build ./cadence/transactions/add_minter.cdc --arg "String:TEST_TOKEN_1" --authorizer deployer --authorizer minter --proposer deployer --payer minter -n testnet --filter payload --save built.rlp
flow transactions sign ./built.rlp --signer deployer -n testnet --filter payload --save signed.rlp
flow transactions sign ./signed.rlp --signer deployer -n testnet --filter payload --save signed.rlp
flow transactions sign ./signed.rlp --signer minter -n testnet --filter payload --save signed.rlp
flow transactions send-signed ./signed.rlp -n testnet
```

* Mint new tokens from **Minter** of type **TEST_TOKEN_1** to **Minter**
```
flow transactions send ./cadence/transactions/mint.cdc --signer minter -n testnet --arg "Address:0xc4b2a5119c7c6cd6" --arg "String:URL" --arg "String:TEST_TOKEN_1"
flow transactions send ./cadence/transactions/mint.cdc --signer minter -n testnet --arg "Address:0xc4b2a5119c7c6cd6" --arg "String:URL" --arg "String:TEST_TOKEN_1"
```

* Transfer token from **Minter** of type **TEST_TOKEN_1** to **Deployer**
```
flow transactions send ./cadence/transactions/transfer.cdc --signer minter -n testnet --arg "Address:0x4f09d8d43e4967b7" --arg "UInt64:0" --arg "String:TEST_TOKEN_1"
```

* Get tokens by address for **Minter** of type **TEST_TOKEN_1**
```
flow scripts execute ./cadence/scripts/token_ids_by_address.cdc --arg "Address:0xc4b2a5119c7c6cd6" --arg "String:TEST_TOKEN_1" -n testnet
```

* Get metadata of token **1** for **Minter** of type **TEST_TOKEN_1**
```
flow scripts execute ./cadence/scripts/metadata.cdc --arg "Address:0xc4b2a5119c7c6cd6" --arg "UInt64:1" --arg "String:TEST_TOKEN_1" -n testnet
```

# Tatum Multi NFT

This token type represents the [Multi NFT token app](./cadence/contracts/TatumNFT.cdc) on the FLOW blockchain.

There are multiple types of NFT token series, each with distinguished sequence and admin minter account.

Tokens can be transferred only inside their token type. None of the token can have the same ID inside the same token type, but can have across them.

### Write operations

* [Setup](./cadence/transactions/setup%20account.cdc) account to be able to receive NFTs
* [Add new minter role](./cadence/transactions/add%20minter.cdc) for new token type - byt default, default minter account has no capabilities to mint tokens of any type
* [Mint new token](./cadence/transactions/mint.cdc) with given type and Metadata URL
* [Transfer NFT token](./cadence/transactions/transfer.cdc) inside the type between multiple recipients

### Read operations

* [Get metadata for token](./cadence/scripts/metadata.cdc) of given type and index
* [Get tokens for recipient](./cadence/scripts/id%20by%20address.cdc) for given type

## Tests
To test the integration, please run `npm run jest`. NodeJS 12+ is required.

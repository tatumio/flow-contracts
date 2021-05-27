pub contract TatumMultiNFT {

    pub var totalSupplies: {String: UInt64}
    pub var minters: {Address: Int}

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, type: String, from: Address?)
    pub event Deposit(id: UInt64, type: String, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub resource NFT {
        pub let id: UInt64

        pub let type: String;
        pub let metadata: String

        init(initID: UInt64, url: String, type: String) {
            self.id = initID
            self.metadata = url
            self.type = type;
        }
    }

    pub resource interface TatumMultiNftCollectionPublic {
        pub fun deposit(token: @NFT)
        pub fun getIDs(type: String): [UInt64]
        pub fun borrowNFT(id: UInt64, type: String): &NFT
        pub fun getMetadata(id: UInt64, type: String): String
        pub fun withdraw(withdrawID: UInt64, type: String): @NFT
    }

    pub resource Collection: TatumMultiNftCollectionPublic {
        pub var types: {String: Int}
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @[{ UInt64: NFT}]

        init () {
            self.ownedNFTs <- []
            self.types = {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64, type: String): @NFT {
            let x = self.types[type] ?? panic("No such token type")
            let token <- self.ownedNFTs[x].remove(key: withdrawID) ?? panic("missing NFT")
            emit Withdraw(id: token.id, type: token.type, from: self.owner?.address)
            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NFT) {
            let id: UInt64 = token.id
            let type: String = token.type

            // find if there is already existing token type
            var x = self.types[type] ?? self.ownedNFTs.length
            if self.types[type] == nil {
                // there is no token of this type, we need to store the index for the later easy access
                self.types[type] = self.ownedNFTs.length
                self.ownedNFTs.append({})
            }
            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[x][id] <- token

            emit Deposit(id: id, type: type, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(type: String): [UInt64] {
            if self.types[type] != nil {
                let x = self.types[type] ?? panic("No such type")
                return self.ownedNFTs[x].keys
            } else {
                return []
            }
        }

        // get metadata URL for the tokenID of given type
        pub fun getMetadata(id: UInt64, type: String): String {
            let x = self.types[type] ?? panic("No such token type")
            let ref = &self.ownedNFTs[x][id] as &NFT
            if ref != nil {
              return ref.metadata
            } else {
              return panic("No such token");
            }
        }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        pub fun borrowNFT(id: UInt64, type: String): &NFT {
            let x = self.types[type] ?? panic("No such token type")
            return &self.ownedNFTs[x][id] as &NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {

        // This minter is allowed to mint only tokens of this type
        pub let type: String;

        init(type: String) {
            self.type = type;
        }

        // mintNFT mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference
        pub fun mintNFT(recipient: &{TatumMultiNftCollectionPublic}, type: String, url: String) {
            if self.type != type {
                panic("Unable to mint token for type, where this account is not a minter")
            }

            // create a new NFT
            var newNFT <- create NFT(initID: TatumMultiNFT.totalSupplies[type] ?? 0 as UInt64, url: url, type: type)

            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)

            TatumMultiNFT.totalSupplies[type] = (TatumMultiNFT.totalSupplies[type] ?? 0 as UInt64) + 1 as UInt64
        }

        pub fun addMinter(minterAccount: AuthAccount, type: String) {
            if TatumMultiNFT.minters[minterAccount.address] == 1 {
                panic("Unable to add minter, already present as a minter for another token type.")
            }
            let minter <- create NFTMinter(type: type)
            minterAccount.save(<-minter, to: TatumMultiNFT.MinterStoragePath)
            TatumMultiNFT.minters[minterAccount.address] = 1;
        }
    }

    init() {
        self.totalSupplies = {}
        self.CollectionStoragePath = /storage/TatumNFTCollection
        self.CollectionPublicPath = /public/TatumNFTCollection
        self.MinterStoragePath = /storage/TatumNFTMinter

        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // create a public capability for the collection
        self.account.link<&{TatumMultiNftCollectionPublic}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter(type: "DEFAULT_ADMIN_MINTER")
        self.account.save(<-minter, to: self.MinterStoragePath)
        self.minters = {self.account.address: 1}

        emit ContractInitialized()
    }
}

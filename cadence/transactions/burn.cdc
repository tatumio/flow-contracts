import TatumMultiNFT from 0x4f09d8d43e4967b7

transaction(withdrawID: UInt64, type: String) {

    // local variable for storing the minter reference
    let senderCollection: &{TatumMultiNFT.TatumMultiNftCollectionPublic}

    prepare(signer: AuthAccount) {

        // borrow a reference to the signer's NFT collection
        self.senderCollection = signer.borrow<&{TatumMultiNFT.TatumMultiNftCollectionPublic}>(from: TatumMultiNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

    }

    execute {
        // withdraw the NFT from the owner's collection
        let nft <- self.senderCollection.withdraw(withdrawID: withdrawID, type: type)

        // Destroy the nft
        destroy nft
    }
}

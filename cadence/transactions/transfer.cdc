import TatumMultiNFT from 0x4f09d8d43e4967b7

transaction(recipient: Address, withdrawID: UInt64) {

    // local variable for storing the minter reference
    let senderCollection: &{TatumMultiNFT.TatumMultiNftCollectionPublic}

    prepare(signer: AuthAccount) {

        // borrow a reference to the signer's NFT collection
        self.senderCollection = signer.borrow<&{TatumMultiNFT.TatumMultiNftCollectionPublic}>(from: TatumMultiNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

    }

    execute {
        // get the recipients public account object
        let recipient = getAccount(recipient)

        // borrow a public reference to the receivers collection
        let depositRef = recipient.getCapability(TatumMultiNFT.CollectionPublicPath).borrow<&{TatumMultiNFT.TatumMultiNftCollectionPublic}>()!

        // withdraw the NFT from the owner's collection
        let nft <- self.senderCollection.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        depositRef.deposit(token: <-nft)
    }
}

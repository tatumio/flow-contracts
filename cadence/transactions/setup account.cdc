import TatumMultiNFT from 0x02

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&TatumMultiNFT.Collection>(from: TatumMultiNFT.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- TatumMultiNFT.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: TatumMultiNFT.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&TatumMultiNFT.Collection>(TatumMultiNFT.CollectionPublicPath, target: TatumMultiNFT.CollectionStoragePath)
        }
    }
}

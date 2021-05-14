import TatumMultiNFT from 0x02

transaction(recipient: Address, url: String, type: String) {

    // local variable for storing the minter reference
    let minter: &TatumMultiNFT.NFTMinter

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&TatumMultiNFT.NFTMinter>(from: TatumMultiNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // get the public account object for the recipient
        let recipient = getAccount(recipient)

        // borrow the recipient's public NFT collection reference
        let receiver = recipient
            .getCapability(TatumMultiNFT.CollectionPublicPath)
            .borrow<&{TatumMultiNFT.TatumMultiNftCollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(recipient: receiver, type: type, url: url)
    }
}

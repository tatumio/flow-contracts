import TatumMultiNFT from 0x02

transaction(type: String) {

    // local variable for storing the minter reference
    let minter: &TatumMultiNFT.NFTMinter

    let newMinter: AuthAccount;

    prepare(adminMinter: AuthAccount, newMinter: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = adminMinter.borrow<&TatumMultiNFT.NFTMinter>(from: TatumMultiNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
        self.newMinter = newMinter;
    }

    execute {
        // add new minter for specific token type
        self.minter.addMinter(minterAccount: self.newMinter, type: type)
    }
}

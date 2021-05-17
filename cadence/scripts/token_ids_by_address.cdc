import TatumMultiNFT from 0x4f09d8d43e4967b7

pub fun main(address: Address, type: String): [UInt64] {
    let collectionRef = getAccount(address)
        .getCapability(TatumMultiNFT.CollectionPublicPath)
        .borrow<&{TatumMultiNFT.TatumMultiNftCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs(type: type)
}

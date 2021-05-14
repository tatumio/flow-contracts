import TatumMultiNFT from 0x02

pub fun main(address: Address, type: String): [UInt64] {
    let collectionRef = getAccount(address)
        .getCapability(TatumMultiNFT.CollectionPublicPath)
        .borrow<&{TatumMultiNFT.TatumMultiNftCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getIDs(type: type)
}

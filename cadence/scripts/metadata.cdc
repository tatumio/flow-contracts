import TatumMultiNFT from 0x02

pub fun main(account: Address, id: UInt64, type: String): String {
    let collectionRef = getAccount(account)
        .getCapability(TatumMultiNFT.CollectionPublicPath)
        .borrow<&{TatumMultiNFT.TatumMultiNftCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    return collectionRef.getMetadata(id: id, type: type)
}

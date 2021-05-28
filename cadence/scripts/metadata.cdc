import TatumMultiNFT from 0x4f09d8d43e4967b7

pub fun main(account: Address, id: UInt64, type: String): String {
    let collectionRef = getAccount(account)
        .getCapability(TatumMultiNFT.CollectionPublicPath)
        .borrow<&{TatumMultiNFT.TatumMultiNftCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    let ref = collectionRef.borrowNFT(id: id, type: type)
    if ref != nil {
      return ref.metadata
    } else {
      return panic("No such token");
    }
}

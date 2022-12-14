const eliminateSameItem = (combinedItemList: (string | never)[], count: number) => {
  const itemKeyObject: { [itemKey: string]: number } = {}

  combinedItemList.forEach((item) => {
    if (itemKeyObject[item]) itemKeyObject[item] += 1
    else itemKeyObject[item] = 1
  })
  const noSameItemList = Object.keys(itemKeyObject).filter((ele) => itemKeyObject[ele] === count)

  return noSameItemList
}

export default eliminateSameItem

// 재사용할 수 있고 직해가 가능한 로직으로 다시 생각해보기

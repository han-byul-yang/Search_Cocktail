import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import getApiData from 'utils/getApiData'
import eliminateSameItem from './utils/eliminateSameItem'
import { cocktailApis } from 'services/getApis'
import { alcoholicList, categoryList, ingredientList } from 'store/initialData/initialListData'
import { filteredItemAtom } from 'store/atom'
import { ICocktailData, IFilteredCocktailData } from 'types/types'
import FilterBox from './FilterBox'
import CocktailContainer from 'components/CocktailContainer'

import { FilterIcon, SearchIcon } from 'assets/svgs'
import styles from './search.module.scss'

const Search = () => {
  const filtering = useRecoilValue(filteredItemAtom)
  const [totalFilteredIdList, setTotalFilteredIdList] = useState<string[]>([''])
  const [totalResult, setTotalResult] = useState<ICocktailData[]>([])
  const [inputKeyword, setInputKeyword] = useState('')
  const [errorMessage, setErrorMessage] = useState('검색결과가 없습니다')
  // const inputRef = useRef(null)
  const dataRef = useRef<ICocktailData[]>([])
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const ingredientSearch = searchParams.get('ingredient')

    if (ingredientSearch !== null)
      getApiData(cocktailApis.filterByIngredients, ingredientSearch).then((result) => setTotalResult(result.drinks))
  }, [searchParams])

  const handleInputKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputKeyword(e.currentTarget.value)
  }

  const cocktailDataToIdList = (resultData: (ICocktailData | IFilteredCocktailData)[] | null | undefined) => {
    if (resultData === null || resultData === undefined) throw Error('검색결과가 없습니다')

    return resultData.map((cocktailData: ICocktailData | IFilteredCocktailData) => cocktailData.idDrink)
  }

  const handleSearchButtonClick = async () => {
    const combinedIdLists: string[] = []
    let filterKindCount = 0

    try {
      if (inputKeyword !== '') {
        filterKindCount += 1

        await getApiData(cocktailApis.searchByName, inputKeyword)
          .then((result) => cocktailDataToIdList(result.drinks))
          .then((result) => combinedIdLists.push(...result))
      }

      if (filtering.alcoholic !== '') {
        filterKindCount += 1

        await getApiData(cocktailApis.filterByAlcoholic, filtering.alcoholic)
          .then((result) => cocktailDataToIdList(result.drinks))
          .then((result) => combinedIdLists.push(...result))
      }

      if (filtering.category !== '') {
        filterKindCount += 1

        await getApiData(cocktailApis.filterByCategory, filtering.category)
          .then((result) => cocktailDataToIdList(result.drinks))
          .then((result) => combinedIdLists.push(...result))
      }

      if (filtering.ingredient !== '') {
        filterKindCount += 1
        await getApiData(cocktailApis.filterByIngredients, filtering.ingredient)
          .then((result) => cocktailDataToIdList(result.drinks))
          .then((result) => combinedIdLists.push(...result))
      }

      const filteredIdList = eliminateSameItem(combinedIdLists, filterKindCount)
      setTotalFilteredIdList(filteredIdList)
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message)
    }
  }

  useEffect(() => {
    // setTotalResult([])
    totalFilteredIdList.forEach(async (filteredId) => {
      const data = await getApiData(cocktailApis.searchById, filteredId)
      dataRef.current = dataRef.current.length === 0 ? [...data.drinks] : [...dataRef.current, ...data.drinks]
      // 데이터 불러올 때마다 리렌더링 되는 문제 해결하기
    })
    setTotalResult(dataRef.current)
  }, [totalFilteredIdList])

  return (
    <>
      <div className={styles.searchBox}>
        <form className={styles.searchForm}>
          <input
            type='search'
            placeholder='Input cocktail name ...'
            value={inputKeyword}
            onChange={handleInputKeywordChange}
          />

          <div className={styles.filterList}>
            <FilterIcon className={styles.filterIcon} />
          </div>

          <button className={styles.filterButton} type='button'>
            FILTER
          </button>
          <button className={styles.searchButton} type='button' onClick={handleSearchButtonClick}>
            SEARCH
          </button>
        </form>

        <div className={styles.filterContainer}>
          <FilterBox filterKind='alcoholic' filterList={alcoholicList} filterCase='single' />
          <FilterBox filterKind='category' filterList={categoryList} filterCase='single' />
          <FilterBox filterKind='ingredient' filterList={ingredientList} filterCase='multiple' />
        </div>
      </div>
      <CocktailContainer totalResult={totalResult} errorMessage={errorMessage} />
    </>
  )
}

export default Search

// 레이아웃 만들기
// 재검색시 검색결과 초기화

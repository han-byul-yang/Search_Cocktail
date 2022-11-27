import { useQuery } from '@tanstack/react-query'

import { popularCocktailApi } from 'services/getCocktailApis'
import CocktailContainer from 'components/CocktailContainer'

import styles from './popular.module.scss'

const Popular = () => {
  const { data: popularCocktailData } = useQuery(['popularCocktailApi'], popularCocktailApi, {
    select: (res) => res.data.drinks,
    cacheTime: 60 * 60 * 60,
    staleTime: 60 * 60 * 60,
  })

  return (
    <div className={styles.popularPage}>
      <CocktailContainer resultData={popularCocktailData} type='popular' />
    </div>
  )
}

export default Popular

import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'

import GNB from 'components/GNB'
import Loader from 'components/Loader'

import cocktailImg from 'assets/img/cocktailTitle.png'
import styles from './layout.module.scss'

const Layout = () => {
  return (
    <div className={styles.layoutContainer}>
      <header>
        <h1>
          <img alt='titleCocktailImg' src={cocktailImg} />
          <Link to='/'>COCKTAIL LIFE</Link>
          <img alt='titleCocktailImg' src={cocktailImg} />
        </h1>
        <GNB />
      </header>
      <main>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default Layout

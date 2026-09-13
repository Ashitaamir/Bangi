import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import WeeklyMenu from './pages/WeeklyMenu'
import SpecialMeals from './pages/SpecialMeals'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      {!isHome && <NavBar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<WeeklyMenu />} />
          <Route path="/special" element={<SpecialMeals />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </main>
    </div>
  )
}

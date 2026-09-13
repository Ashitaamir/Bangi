import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useCart } from '../context/CartContext'

export default function NavBar() {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-bark/10">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Logo size={36} />
          <span className="font-display text-lg sm:text-xl font-bold text-bark tracking-wide">Bangi</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-clay-dark">
          <Link to="/menu" className="whitespace-nowrap hover:text-terracotta transition-colors">
            <span className="hidden sm:inline">Weekly Menu</span>
            <span className="sm:hidden">Menu</span>
          </Link>
          <Link to="/special" className="whitespace-nowrap hover:text-terracotta transition-colors">
            Specials
          </Link>
          <Link
            to="/checkout"
            className="relative whitespace-nowrap bg-terracotta text-cream px-3 py-1.5 rounded-full hover:bg-alpona transition-colors"
          >
            Order
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-bark text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MenuItemCard from '../components/MenuItemCard'
import CartBar from '../components/CartBar'
import AlponaDivider from '../components/AlponaDivider'
import { weeklyMenu } from '../data/menu'

export default function WeeklyMenu() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-32">
      <Link to="/" className="text-clay-dark text-sm font-semibold hover:text-terracotta">
        ← Back home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-4"
      >
        <h1 className="font-display text-4xl font-extrabold text-bark">This Week's Menu</h1>
        <p className="text-clay-dark font-semibold mt-1">{weeklyMenu.weekLabel}</p>
        <p className="text-terracotta text-sm font-bold mt-1">{weeklyMenu.orderWindow}</p>
        <AlponaDivider />
      </motion.div>

      <div className="mt-6 grid gap-5">
        {weeklyMenu.items.map((item) => (
          <MenuItemCard key={item.id} item={item} sourceType="weekly" />
        ))}
      </div>

      <CartBar />
    </div>
  )
}

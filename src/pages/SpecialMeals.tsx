import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MenuItemCard from '../components/MenuItemCard'
import CartBar from '../components/CartBar'
import AlponaDivider from '../components/AlponaDivider'
import { specialMeals } from '../data/menu'

export default function SpecialMeals() {
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
        <h1 className="font-display text-4xl font-extrabold text-bark">Today's Specials</h1>
        <p className="text-clay-dark font-semibold mt-1">Limited quantities, first come first served</p>
        <AlponaDivider />
      </motion.div>

      {specialMeals.length === 0 ? (
        <p className="text-center text-clay-dark mt-12">No specials posted right now — check back soon!</p>
      ) : (
        <div className="mt-6 grid gap-5">
          {specialMeals.map((item) => (
            <MenuItemCard key={item.id} item={item} sourceType="special" badge={item.availability} />
          ))}
        </div>
      )}

      <CartBar />
    </div>
  )
}

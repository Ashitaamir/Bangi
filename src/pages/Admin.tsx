import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWeeklyMenu } from '../hooks/useWeeklyMenu'
import { useSpecialMeals } from '../hooks/useSpecialMeals'
import { isFirebaseConfigured } from '../lib/firebase'
import {
  addPlanItem,
  addSpecialMeal,
  collectionIsEmpty,
  deletePlanItem,
  deleteSpecialMeal,
  savePlanSettings,
  seedDefaultMenu,
  updatePlanItem,
  updateSpecialMeal,
} from '../lib/menuAdmin'
import PlanItemForm from '../components/admin/PlanItemForm'
import SpecialMealForm from '../components/admin/SpecialMealForm'
import type { PlanItem, SpecialMeal } from '../data/types'
import Logo from '../components/Logo'

export default function Admin() {
  const { user, loading, signIn, signOut } = useAuth()

  if (!isFirebaseConfigured) {
    return (
      <div className="max-w-md mx-auto px-4 pt-20 text-center">
        <h1 className="font-display text-2xl font-bold text-bark">Admin not set up yet</h1>
        <p className="text-clay-dark mt-2 text-sm">
          This site's backend (Firebase) hasn't been connected yet. See the "Owner admin setup"
          section in README.md for the one-time setup steps.
        </p>
        <Link to="/" className="inline-block mt-6 text-terracotta font-bold hover:underline">
          ← Back to site
        </Link>
      </div>
    )
  }

  if (loading) {
    return <p className="text-center text-clay-dark pt-20">Loading…</p>
  }

  if (!user) {
    return <AdminLogin onSignIn={signIn} />
  }

  return <AdminDashboard onSignOut={signOut} />
}

function AdminLogin({ onSignIn }: { onSignIn: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onSignIn(email, password)
    } catch {
      setError('Wrong email or password.')
    }
    setSubmitting(false)
  }

  return (
    <div className="max-w-sm mx-auto px-4 pt-20">
      <div className="flex justify-center mb-6">
        <Logo className="h-14" />
      </div>
      <h1 className="font-display text-2xl font-bold text-bark text-center">Owner Login</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="rounded-lg border border-bark/20 px-4 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="rounded-lg border border-bark/20 px-4 py-2.5 bg-cream focus:outline-none focus:ring-2 focus:ring-gold"
        />
        {error && <p className="text-terracotta text-sm font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-terracotta hover:bg-alpona text-cream font-bold py-2.5 rounded-full disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <Link to="/" className="block text-center mt-6 text-sm text-clay-dark hover:text-terracotta">
        ← Back to site
      </Link>
    </div>
  )
}

function AdminDashboard({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const { weeklyMenu, loading: menuLoading } = useWeeklyMenu()
  const { specialMeals, loading: specialsLoading } = useSpecialMeals()

  const [weekLabel, setWeekLabel] = useState('')
  const [orderWindow, setOrderWindow] = useState('')
  const [planPrice, setPlanPrice] = useState('')
  const [settingsSaved, setSettingsSaved] = useState(false)

  const [addingPlanItem, setAddingPlanItem] = useState(false)
  const [editingPlanItemId, setEditingPlanItemId] = useState<string | null>(null)
  const [addingSpecial, setAddingSpecial] = useState(false)
  const [editingSpecialId, setEditingSpecialId] = useState<string | null>(null)

  const [showSeed, setShowSeed] = useState(false)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    if (!menuLoading) {
      setWeekLabel(weeklyMenu.weekLabel)
      setOrderWindow(weeklyMenu.orderWindow)
      setPlanPrice(String(weeklyMenu.planPrice))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuLoading])

  useEffect(() => {
    collectionIsEmpty('weeklyPlanItems').then(setShowSeed)
  }, [])

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    await savePlanSettings({
      weekLabel,
      orderWindow,
      planPrice: Number(planPrice) || 0,
    })
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 1800)
  }

  async function handleSeed() {
    setSeeding(true)
    await seedDefaultMenu()
    setSeeding(false)
    setShowSeed(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-clay-dark text-sm font-semibold hover:text-terracotta">
          ← Back to site
        </Link>
        <button onClick={() => onSignOut()} className="text-sm font-semibold text-bark/60 hover:text-terracotta">
          Log out
        </button>
      </div>

      <h1 className="font-display text-3xl font-extrabold text-bark text-center mt-3">
        Bangi Admin
      </h1>

      {showSeed && (
        <div className="mt-6 bg-gold/20 border border-gold rounded-xl p-4 text-center">
          <p className="text-sm text-bark">
            Your menu is empty. Load the sample menu to get started (you can edit or delete
            anything after).
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="mt-2 bg-gold text-bark font-bold px-4 py-2 rounded-full text-sm disabled:opacity-60"
          >
            {seeding ? 'Loading…' : 'Load Sample Menu'}
          </button>
        </div>
      )}

      {/* Plan settings */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-bold text-bark mb-3">Weekly Plan Settings</h2>
        <form onSubmit={handleSaveSettings} className="grid gap-3 bg-parchment/70 rounded-xl p-4 rustic-border">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm text-bark/70">
              Week label
              <input
                value={weekLabel}
                onChange={(e) => setWeekLabel(e.target.value)}
                placeholder="Week of September 12"
                className="mt-1 w-full rounded border border-bark/20 px-3 py-2 bg-cream"
              />
            </label>
            <label className="text-sm text-bark/70">
              Order window
              <input
                value={orderWindow}
                onChange={(e) => setOrderWindow(e.target.value)}
                placeholder="Ordering open Friday — Sunday, midnight"
                className="mt-1 w-full rounded border border-bark/20 px-3 py-2 bg-cream"
              />
            </label>
          </div>
          <label className="text-sm text-bark/70">
            Plan price ($)
            <input
              type="number"
              step="0.5"
              min="0"
              value={planPrice}
              onChange={(e) => setPlanPrice(e.target.value)}
              className="mt-1 w-full sm:w-40 rounded border border-bark/20 px-3 py-2 bg-cream"
            />
          </label>
          <div>
            <button
              type="submit"
              className="bg-terracotta hover:bg-alpona text-cream font-bold px-5 py-2 rounded-full text-sm"
            >
              {settingsSaved ? 'Saved ✓' : 'Save Settings'}
            </button>
          </div>
        </form>
      </section>

      {/* Weekly plan items */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-bold text-bark">
            Weekly Plan Dishes {!menuLoading && `(${weeklyMenu.items.length})`}
          </h2>
          {!addingPlanItem && (
            <button
              onClick={() => setAddingPlanItem(true)}
              className="text-sm font-bold text-terracotta hover:underline"
            >
              + Add dish
            </button>
          )}
        </div>

        {addingPlanItem && (
          <div className="mb-3">
            <PlanItemForm
              onSave={async (item) => {
                await addPlanItem(item)
                setAddingPlanItem(false)
              }}
              onCancel={() => setAddingPlanItem(false)}
            />
          </div>
        )}

        <div className="grid gap-3">
          {weeklyMenu.items.map((item) =>
            editingPlanItemId === item.id ? (
              <PlanItemForm
                key={item.id}
                initial={item}
                onSave={async (updated) => {
                  await updatePlanItem(item.id, updated)
                  setEditingPlanItemId(null)
                }}
                onCancel={() => setEditingPlanItemId(null)}
              />
            ) : (
              <PlanItemSummaryCard
                key={item.id}
                item={item}
                onEdit={() => setEditingPlanItemId(item.id)}
                onDelete={() => deletePlanItem(item.id)}
              />
            ),
          )}
        </div>
      </section>

      {/* Specials */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-bold text-bark">
            Specials {!specialsLoading && `(${specialMeals.length})`}
          </h2>
          {!addingSpecial && (
            <button
              onClick={() => setAddingSpecial(true)}
              className="text-sm font-bold text-terracotta hover:underline"
            >
              + Add special
            </button>
          )}
        </div>

        {addingSpecial && (
          <div className="mb-3">
            <SpecialMealForm
              onSave={async (item) => {
                await addSpecialMeal(item)
                setAddingSpecial(false)
              }}
              onCancel={() => setAddingSpecial(false)}
            />
          </div>
        )}

        <div className="grid gap-3">
          {specialMeals.map((item) =>
            editingSpecialId === item.id ? (
              <SpecialMealForm
                key={item.id}
                initial={item}
                onSave={async (updated) => {
                  await updateSpecialMeal(item.id, updated)
                  setEditingSpecialId(null)
                }}
                onCancel={() => setEditingSpecialId(null)}
              />
            ) : (
              <SpecialMealSummaryCard
                key={item.id}
                item={item}
                onEdit={() => setEditingSpecialId(item.id)}
                onDelete={() => deleteSpecialMeal(item.id)}
              />
            ),
          )}
          {!specialsLoading && specialMeals.length === 0 && !addingSpecial && (
            <p className="text-sm text-bark/50">No specials posted. That's fine — they're optional.</p>
          )}
        </div>
      </section>
    </div>
  )
}

function PlanItemSummaryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: PlanItem
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 bg-parchment/70 rounded-xl p-4 rustic-border">
      <div className="flex gap-3">
        <span className="text-2xl">{item.emoji}</span>
        <div>
          <p className="font-bold text-bark">{item.name}</p>
          <p className="text-sm text-bark/70">{item.description}</p>
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-clay-dark">
            {item.substitutions?.map((g) => <span key={g.id}>🧩 {g.label}</span>)}
            {item.extraPrice != null && <span>➕ Extra +${item.extraPrice.toFixed(2)}</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0 text-sm">
        <button onClick={onEdit} className="font-semibold text-clay-dark hover:text-terracotta">
          Edit
        </button>
        <button onClick={onDelete} className="font-semibold text-bark/40 hover:text-terracotta">
          Delete
        </button>
      </div>
    </div>
  )
}

function SpecialMealSummaryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: SpecialMeal
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 bg-parchment/70 rounded-xl p-4 rustic-border">
      <div className="flex gap-3">
        <span className="text-2xl">{item.emoji}</span>
        <div>
          <p className="font-bold text-bark">
            {item.name} <span className="text-terracotta">${item.price.toFixed(2)}</span>
          </p>
          <p className="text-sm text-bark/70">{item.description}</p>
          <span className="text-xs text-clay-dark">{item.availability}</span>
        </div>
      </div>
      <div className="flex gap-2 shrink-0 text-sm">
        <button onClick={onEdit} className="font-semibold text-clay-dark hover:text-terracotta">
          Edit
        </button>
        <button onClick={onDelete} className="font-semibold text-bark/40 hover:text-terracotta">
          Delete
        </button>
      </div>
    </div>
  )
}

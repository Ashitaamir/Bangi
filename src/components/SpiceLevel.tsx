export default function SpiceLevel({ level }: { level?: 1 | 2 | 3 }) {
  if (!level) return null
  return (
    <span className="inline-flex items-center gap-0.5" title={`Spice level ${level}/3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= level ? 'opacity-100' : 'opacity-20'}>
          🌶️
        </span>
      ))}
    </span>
  )
}

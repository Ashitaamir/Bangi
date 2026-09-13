export default function AlponaDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`w-full flex justify-center py-2 ${flip ? 'rotate-180' : ''}`} aria-hidden>
      <svg width="220" height="24" viewBox="0 0 220 24" fill="none">
        <path
          d="M2 12c10-14 20 14 30 0s20-14 30 0 20 14 30 0 20-14 30 0 20 14 30 0 20-14 30 0 20 14 34 0"
          stroke="#B5451B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="110" cy="12" r="3" fill="#C9982B" />
      </svg>
    </div>
  )
}

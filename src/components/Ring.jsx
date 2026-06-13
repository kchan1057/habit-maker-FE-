export default function Ring({ value = 0, size = 116, stroke = 11, label = '달성도' }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFE9DD" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1FA46F" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-ink leading-none">{value}<span className="text-base">%</span></div>
        <div className="text-[11px] text-ink-faint mt-1">{label}</div>
      </div>
    </div>
  )
}

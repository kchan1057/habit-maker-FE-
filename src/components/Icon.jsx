// 가벼운 라인 아이콘 세트. 이모지 대신 사용. 색은 currentColor.
const paths = {
  home: <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v3M16 3v3" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  flame: <path d="M12 3s4 3.5 4 8a4 4 0 1 1-8 0c0-1.6.7-2.8 1.4-3.6C10 9 11 8 12 3z" />,
  trophy: <><path d="M7 4h10v3a5 5 0 0 1-10 0z" /><path d="M5 5H3v1a3 3 0 0 0 3 3M19 5h2v1a3 3 0 0 1-3 3M9 13h6M10 20h4M12 13v3" /></>,
  logout: <path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 12H3m0 0 3-3m-3 3 3 3" />,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /></>,
  arrow: <path d="M5 12h14m0 0-5-5m5 5-5 5" />,
  dot: <circle cx="12" cy="12" r="4" />,
}

export default function Icon({ name, size = 20, className = '', stroke = 1.75 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

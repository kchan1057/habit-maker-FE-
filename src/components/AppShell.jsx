import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { api } from '../api'

const NAV = [
  ['/home', '대시보드', 'home'],
  ['/routines/new', '루틴 등록', 'plus'],
  ['/today', '오늘의 루틴', 'check'],
  ['/tracker', '66일 트래커', 'calendar'],
  ['/stats', '통계 분석', 'chart'],
  ['/recommend', 'AI 추천', 'spark'],
]

export default function AppShell({ children }) {
  const navigate = useNavigate()
  const [me, setMe] = useState(null)

  useEffect(() => {
    api.get('/api/users/me').then(setMe).catch(() => {})
  }, [])

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-cream">
      {/* 사이드바 */}
      <aside className="w-[248px] shrink-0 bg-white border-r border-line flex flex-col fixed inset-y-0 left-0">
        <div className="px-6 py-6 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-brand text-white grid place-items-center">
            <Icon name="dot" size={16} stroke={0} className="fill-current" />
          </span>
          <span className="font-bold text-lg tracking-tight">habit<span className="text-brand">·</span>maker</span>
        </div>

        <nav className="px-3 flex-1 space-y-1">
          {NAV.map(([to, label, icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/home'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-soft text-brand-dark'
                    : 'text-ink-muted hover:bg-cream-sink hover:text-ink'
                }`
              }
            >
              <Icon name={icon} size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <div className="card p-3 flex items-center gap-3 shadow-none">
            <span className="w-9 h-9 rounded-full bg-brand-soft text-brand-dark grid place-items-center font-bold text-sm">
              {me?.nickname?.[0] ?? 'U'}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{me?.nickname ?? '사용자'}</div>
              <div className="text-xs text-ink-faint">Lv {me?.level ?? 1} · {me?.points ?? 0}P</div>
            </div>
          </div>
          <button onClick={logout} className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-ink-faint hover:bg-cream-sink hover:text-ink transition">
            <Icon name="logout" size={18} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* 본문 */}
      <main className="flex-1 ml-[248px] min-h-screen">
        <div className="max-w-6xl mx-auto px-10 py-10">{children}</div>
      </main>
    </div>
  )
}

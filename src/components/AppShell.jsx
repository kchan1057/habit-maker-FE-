import { NavLink, useNavigate } from 'react-router-dom'

const LINKS = [
  ['/home', '홈'],
  ['/routines/new', '루틴 등록'],
  ['/today', '오늘'],
  ['/tracker', '트래커'],
  ['/stats', '통계'],
  ['/recommend', 'AI 추천'],
]

export default function AppShell({ children }) {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <h1 className="text-lg font-bold whitespace-nowrap">habit-maker</h1>
          <nav className="flex gap-1 text-sm overflow-x-auto">
            {LINKS.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 font-semibold'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-700 whitespace-nowrap">
            로그아웃
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}

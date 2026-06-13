import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { api } from '../api'

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [dash, setDash] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const loadDash = async () => {
    const d = await api.get('/api/dashboard')
    setDash(d)
  }

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) { navigate('/'); return }
    Promise.all([api.get('/api/users/me'), loadDash()])
      .then(([u]) => setUser(u))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [navigate])

  const toggle = async (item) => {
    setBusyId(item.id)
    try {
      await api.post(`/api/routines/items/${item.id}/check`)
      await loadDash()
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <AppShell><p className="text-gray-500">로딩 중...</p></AppShell>

  return (
    <AppShell>
      <section className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1">안녕하세요, {user?.nickname}님 👋</h2>
          <p className="text-gray-500">오늘도 좋은 습관 만들어봐요!</p>
        </div>
        {dash && (
          <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">
            Lv {dash.level}
          </span>
        )}
      </section>

      {/* 달성도 게이지 */}
      {dash && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-5 shadow-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-90">오늘의 달성도</span>
            <span className="text-2xl font-bold">{dash.todayAchievementRate}%</span>
          </div>
          <div className="h-2.5 bg-white/30 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${dash.todayAchievementRate}%` }} />
          </div>
          <div className="flex gap-6 text-sm opacity-90">
            <span>🔥 연속 {dash.totalStreak}일</span>
            <span>⭐ {dash.points}P</span>
            <span>🏅 뱃지 {dash.badgeCount}개</span>
          </div>
        </div>
      )}

      {/* 프로필 카드 */}
      {user && (
        <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">내 프로필</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">{user.mbti}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">나이</span><p className="font-medium mt-1">{user.age}세</p></div>
            <div><span className="text-gray-500">직업</span><p className="font-medium mt-1">{user.job}</p></div>
            <div><span className="text-gray-500">자는 시간</span><p className="font-medium mt-1">{user.sleepTime?.slice(0,5)}</p></div>
            <div><span className="text-gray-500">일어나는 시간</span><p className="font-medium mt-1">{user.wakeTime?.slice(0,5)}</p></div>
          </div>
        </section>
      )}

      {/* 오늘의 루틴 */}
      <section className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">오늘의 루틴</h3>
          <button onClick={() => navigate('/routines/new')}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + 습관 추가
          </button>
        </div>

        {!dash || dash.todayItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-5xl mb-3">🎯</p>
            <p className="text-gray-500 mb-1">오늘 예정된 루틴이 없어요</p>
            <p className="text-gray-400 text-sm">새 습관을 추가하고 AI가 만들어주는 루틴을 받아보세요</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dash.todayItems.map((it) => (
              <button
                key={it.id}
                onClick={() => toggle(it)}
                disabled={busyId === it.id}
                className={`w-full flex items-center gap-3 border border-gray-100 rounded-xl p-4 text-left transition hover:bg-gray-50 disabled:opacity-50 ${it.doneToday ? 'opacity-70' : ''}`}
              >
                <span className={`w-6 h-6 rounded-md flex items-center justify-center border-2 text-xs ${
                  it.doneToday ? 'bg-purple-500 border-purple-500 text-white' : 'border-gray-300 text-transparent'
                }`}>✓</span>
                <div className="flex-1">
                  <div className={`font-medium ${it.doneToday ? 'line-through text-gray-400' : ''}`}>{it.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{it.dayOfWeek} · {it.time} · {it.category}</div>
                </div>
                <span className="text-xs text-purple-500 font-semibold">+10p</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  )
}

export default Home

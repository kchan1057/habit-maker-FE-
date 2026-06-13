import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import Ring from '../components/Ring'
import Icon from '../components/Icon'
import { api } from '../api'

function StatCard({ icon, label, value, suffix }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-ink-faint mb-3">
        <Icon name={icon} size={18} /><span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-ink">{value}<span className="text-base font-semibold text-ink-muted">{suffix}</span></div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [dash, setDash] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const d = await api.get('/api/dashboard')
    setDash(d)
  }
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) { navigate('/'); return }
    load().catch(() => navigate('/')).finally(() => setLoading(false))
  }, [navigate])

  const toggle = async (item) => {
    setBusyId(item.id)
    try { await api.post(`/api/routines/items/${item.id}/check`); await load() }
    finally { setBusyId(null) }
  }

  if (loading || !dash) return <AppShell><p className="sub">불러오는 중…</p></AppShell>

  return (
    <AppShell>
      <header className="flex items-end justify-between mb-8">
        <div>
          <p className="sub mb-1">오늘도 차근차근, 좋은 하루예요</p>
          <h1 className="h-page text-3xl">{dash.nickname}님의 하루</h1>
        </div>
        <button onClick={() => navigate('/routines/new')} className="btn-primary">
          <Icon name="plus" size={18} /> 새 루틴
        </button>
      </header>

      {/* 상단: 달성도 링 + 통계 */}
      <section className="grid grid-cols-12 gap-5 mb-6">
        <div className="col-span-12 lg:col-span-4 card p-6 flex items-center gap-6">
          <Ring value={dash.todayAchievementRate} />
          <div>
            <div className="text-sm text-ink-muted mb-1">오늘의 달성도</div>
            <div className="text-ink-faint text-xs leading-relaxed">
              오늘 예정된 루틴 중<br />완료한 비율이에요
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-5">
          <StatCard icon="flame" label="연속 달성" value={dash.totalStreak} suffix="일" />
          <StatCard icon="target" label="포인트" value={dash.points} suffix="P" />
          <StatCard icon="trophy" label="획득 뱃지" value={dash.badgeCount} suffix="개" />
        </div>
      </section>

      {/* 오늘의 루틴 */}
      <section className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">오늘의 루틴</h2>
          <span className="chip-mute">
            {dash.todayItems.filter((i) => i.doneToday).length} / {dash.todayItems.length} 완료
          </span>
        </div>

        {dash.todayItems.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-line rounded-xl2">
            <p className="text-ink-muted mb-1">오늘 예정된 루틴이 없어요</p>
            <p className="sub mb-5">새 습관을 등록하면 AI가 루틴을 설계해드려요</p>
            <button onClick={() => navigate('/routines/new')} className="btn-primary mx-auto">
              <Icon name="plus" size={18} /> 루틴 만들기
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {dash.todayItems.map((it, idx) => (
              <li key={it.id}>
                <button
                  onClick={() => toggle(it)}
                  disabled={busyId === it.id}
                  className="w-full flex items-center gap-4 py-3.5 text-left group disabled:opacity-50"
                >
                  <span className="w-7 text-sm text-ink-faint tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                  <span className={`w-6 h-6 rounded-lg grid place-items-center border transition ${
                    it.doneToday ? 'bg-brand border-brand text-white' : 'border-line text-transparent group-hover:border-brand-mid'
                  }`}>
                    <Icon name="check" size={14} stroke={2.4} />
                  </span>
                  <span className="flex-1">
                    <span className={`font-medium ${it.doneToday ? 'line-through text-ink-faint' : 'text-ink'}`}>{it.title}</span>
                    <span className="block text-xs text-ink-faint mt-0.5">{it.time || '시간 미정'} · {it.category || '일반'}</span>
                  </span>
                  <span className="chip-green">+10P</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  )
}

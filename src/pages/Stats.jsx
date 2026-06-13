import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import Icon from '../components/Icon'
import { api } from '../api'

function Stat({ icon, label, value, suffix }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-ink-faint mb-2"><Icon name={icon} size={18} /><span className="text-sm">{label}</span></div>
      <div className="text-2xl font-bold">{value}<span className="text-base text-ink-muted">{suffix}</span></div>
    </div>
  )
}

export default function Stats() {
  const [data, setData] = useState(null)
  useEffect(() => { api.get('/api/stats').then(setData).catch(() => setData(null)) }, [])
  if (!data) return <AppShell><p className="sub">불러오는 중…</p></AppShell>

  const weekly = Object.entries(data.weeklyRate)
  const cats = Object.entries(data.categoryRate)

  return (
    <AppShell>
      <header className="mb-8">
        <p className="sub mb-1">데이터로 보는 나의 습관</p>
        <h1 className="h-page text-3xl">통계 분석</h1>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <Stat icon="target" label="오늘 달성률" value={data.overallRate} suffix="%" />
        <Stat icon="flame" label="최고 연속일" value={data.maxStreak} suffix="일" />
        <Stat icon="dot" label="총 포인트" value={data.totalPoints} suffix="P" />
        <Stat icon="check" label="완료한 루틴" value={data.completedTasks} suffix="개" />
      </section>

      <div className="grid grid-cols-12 gap-5">
        <section className="col-span-12 lg:col-span-7 card p-6">
          <h2 className="font-bold mb-5">요일별 달성률</h2>
          <div className="flex items-end gap-3 h-44">
            {weekly.map(([k, v]) => (
              <div key={k} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs text-ink-faint">{v}%</span>
                <div className="w-full bg-cream-deep rounded-lg overflow-hidden flex items-end" style={{ height: '100%' }}>
                  <div className="w-full bg-brand rounded-lg transition-all" style={{ height: `${v}%` }} />
                </div>
                <span className="text-xs text-ink-muted">{k}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-5 card p-6">
          <h2 className="font-bold mb-5">카테고리별 비중</h2>
          {cats.length === 0 ? (
            <p className="sub">아직 데이터가 없어요</p>
          ) : (
            <div className="space-y-4">
              {cats.map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-ink">{k}</span><span className="text-ink-faint">{v}%</span></div>
                  <div className="h-2.5 bg-cream-deep rounded-full overflow-hidden">
                    <div className="h-full bg-brand-mid rounded-full transition-all" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}

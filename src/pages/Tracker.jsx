import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api } from '../api'

export default function Tracker() {
  const [data, setData] = useState(null)
  useEffect(() => { api.get('/api/tracker').then(setData).catch(() => setData({ routines: [] })) }, [])

  return (
    <AppShell>
      <header className="mb-8">
        <p className="sub mb-1">매일 쌓여가는 나만의 리듬</p>
        <h1 className="h-page text-3xl">66일 습관 트래커</h1>
      </header>

      {!data ? (
        <p className="sub">불러오는 중…</p>
      ) : data.routines.length === 0 ? (
        <div className="card p-14 text-center text-ink-muted">등록된 루틴이 없어요</div>
      ) : (
        <div className="space-y-5">
          {data.routines.map((r) => (
            <div key={r.routineId} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold">{r.habit}</h2>
                  <p className="sub mt-0.5">시작일 {r.startDate}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand">{r.progressPercent}<span className="text-base">%</span></div>
                  <div className="text-xs text-ink-faint">66일 중 달성</div>
                </div>
              </div>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(22, minmax(0, 1fr))' }}>
                {r.days.map((d) => (
                  <div key={d.dayIndex} title={`${d.dayIndex}일차 · ${d.date}`}
                    className={`aspect-square rounded-[5px] ${d.done ? 'bg-brand' : 'bg-cream-deep'}`} />
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-ink-faint">
                <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-[3px] bg-brand inline-block" /> 달성</span>
                <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-[3px] bg-cream-deep inline-block" /> 미달성</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}

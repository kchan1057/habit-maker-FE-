import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import Ring from '../components/Ring'
import Icon from '../components/Icon'
import { api } from '../api'

export default function Today() {
  const [items, setItems] = useState([])
  const [rate, setRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState(null)

  const load = async () => {
    const list = await api.get('/api/routines/today')
    setItems(list)
    const done = list.filter((i) => i.doneToday).length
    setRate(list.length ? Math.round((done / list.length) * 100) : 0)
  }
  useEffect(() => { load().catch(() => {}).finally(() => setLoading(false)) }, [])

  const toggle = async (item) => {
    setBusyId(item.id)
    try {
      const r = await api.post(`/api/routines/items/${item.id}/check`)
      setRate(r.achievementRate)
      if (r.newBadges?.length) {
        setToast(`새 뱃지 획득 — ${r.newBadges.join(', ')}`)
        setTimeout(() => setToast(null), 3500)
      }
      await load()
    } finally { setBusyId(null) }
  }

  return (
    <AppShell>
      <header className="mb-8">
        <p className="sub mb-1">한 번에 하나씩, 순서대로</p>
        <h1 className="h-page text-3xl">오늘의 루틴</h1>
      </header>

      {toast && (
        <div className="card px-4 py-3 mb-5 flex items-center gap-2 text-brand-dark bg-brand-soft border-brand-border">
          <Icon name="trophy" size={18} /> {toast}
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4 card p-6 flex flex-col items-center justify-center text-center">
          <Ring value={rate} size={140} />
          <p className="sub mt-4">완료 {items.filter((i) => i.doneToday).length} / 전체 {items.length}</p>
        </div>

        <div className="col-span-12 lg:col-span-8 card p-6">
          {loading ? (
            <p className="sub">불러오는 중…</p>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-ink-muted">오늘 예정된 루틴이 없어요</div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((it, idx) => (
                <li key={it.id}>
                  <button onClick={() => toggle(it)} disabled={busyId === it.id}
                    className="w-full flex items-center gap-4 py-4 text-left group disabled:opacity-50">
                    <span className="w-6 text-sm text-ink-faint tabular-nums">{idx + 1}</span>
                    <span className={`w-6 h-6 rounded-lg grid place-items-center border transition ${
                      it.doneToday ? 'bg-brand border-brand text-white' : 'border-line text-transparent group-hover:border-brand-mid'
                    }`}>
                      <Icon name="check" size={14} stroke={2.4} />
                    </span>
                    <span className="flex-1">
                      <span className={`font-medium ${it.doneToday ? 'line-through text-ink-faint' : 'text-ink'}`}>{it.title}</span>
                      <span className="block text-xs text-ink-faint mt-0.5 flex items-center gap-1">
                        <Icon name="clock" size={13} /> {it.time || '미정'} · {it.dayOfWeek || ''} · {it.category || '일반'}
                      </span>
                    </span>
                    <span className="chip-green">+10P</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  )
}

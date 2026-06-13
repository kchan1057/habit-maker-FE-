import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api } from '../api'

function Today() {
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
    setLoading(false)
  }
  useEffect(() => { load().catch(() => setLoading(false)) }, [])

  const toggle = async (item) => {
    setBusyId(item.id)
    try {
      const r = await api.post(`/api/routines/items/${item.id}/check`)
      setRate(r.achievementRate)
      if (r.newBadges?.length) {
        setToast(`🏅 새 뱃지 획득: ${r.newBadges.join(', ')}`)
        setTimeout(() => setToast(null), 3500)
      }
      await load()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AppShell>
      <h2 className="text-2xl font-bold mb-4">오늘의 루틴</h2>

      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-5 shadow-md mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm opacity-90">달성도 레벨</span>
          <span className="text-2xl font-bold">{rate}%</span>
        </div>
        <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${rate}%` }} />
        </div>
      </div>

      {toast && <div className="bg-amber-100 text-amber-700 text-sm rounded-xl p-3 mb-4">{toast}</div>}

      {loading ? (
        <p className="text-gray-400">불러오는 중…</p>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <p className="text-4xl mb-2">🎯</p>
          <p className="text-gray-500">오늘 예정된 루틴이 없어요.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => toggle(it)}
              disabled={busyId === it.id}
              className={`w-full flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 text-left transition hover:shadow-md disabled:opacity-50 ${
                it.doneToday ? 'opacity-70' : ''
              }`}
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
    </AppShell>
  )
}

export default Today

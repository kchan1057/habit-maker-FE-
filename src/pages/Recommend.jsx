import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import Icon from '../components/Icon'
import { api } from '../api'

export default function Recommend() {
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [seed, setSeed] = useState('')
  const [rec, setRec] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/api/routines').then((rs) => {
      setHabits(rs.map((r) => r.habit)); if (rs[0]) setSeed(rs[0].habit)
    }).catch(() => {})
  }, [])

  const recommend = async () => {
    const base = seed || habits[0]
    if (!base) { setError('먼저 루틴을 1개 이상 등록하세요.'); return }
    setLoading(true); setError(null); setRec(null)
    try {
      setRec(await api.post('/api/routines/generate', {
        text: `${base} 습관을 더 잘 지키기 위한 보강 루틴을 추천해줘`, level: 'intermediate', daysPerWeek: 5,
      }))
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  const save = async () => {
    setLoading(true)
    try {
      await api.post('/api/routines', { habit: rec.habit, level: 'intermediate', daysPerWeek: 5, items: rec.routineItems })
      navigate('/home')
    } finally { setLoading(false) }
  }

  return (
    <AppShell>
      <header className="mb-8">
        <p className="sub mb-1 flex items-center gap-1.5"><Icon name="spark" size={15} /> 과거 기록 기반 개인화 추천</p>
        <h1 className="h-page text-3xl">AI 루틴 추천</h1>
      </header>

      <div className="card p-6 mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label className="label">보강할 습관 선택</label>
            <select className="field" value={seed} onChange={(e) => setSeed(e.target.value)} disabled={habits.length === 0}>
              {habits.length === 0 ? <option>등록된 루틴 없음</option> : habits.map((h, i) => <option key={i} value={h}>{h}</option>)}
            </select>
          </div>
          <button onClick={recommend} disabled={loading} className="btn-primary">
            <Icon name="spark" size={18} /> {loading && !rec ? 'AI 분석 중…' : '추천 받기'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
      </div>

      {rec && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{rec.habit} · 보강 루틴</h2>
            <span className="chip-green"><Icon name="spark" size={13} /> AI 추천</span>
          </div>
          <ul className="space-y-2.5">
            {rec.routineItems.map((it, i) => (
              <li key={i} className="border border-line rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{it.title}</span>
                  <span className="text-xs text-ink-faint">{it.dayOfWeek} {it.time}</span>
                </div>
                <p className="text-sm text-ink-muted mt-1.5">{it.description}</p>
                <div className="flex gap-1.5 mt-2.5"><span className="chip-mute">{it.category}</span><span className="chip-mute">{it.difficulty}</span></div>
              </li>
            ))}
          </ul>
          <button onClick={save} disabled={loading} className="btn-primary w-full mt-5">
            <Icon name="plus" size={18} /> 추천 루틴 추가하기
          </button>
        </div>
      )}
    </AppShell>
  )
}

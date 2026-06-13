import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { api } from '../api'

function Recommend() {
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [seed, setSeed] = useState('')
  const [rec, setRec] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/api/routines').then((rs) => {
      setHabits(rs.map((r) => r.habit))
      if (rs[0]) setSeed(rs[0].habit)
    }).catch(() => {})
  }, [])

  const recommend = async () => {
    const base = seed || habits[0]
    if (!base) { setError('먼저 루틴을 1개 이상 등록하세요.'); return }
    setLoading(true); setError(null); setRec(null)
    try {
      const res = await api.post('/api/routines/generate', {
        text: `${base} 습관을 더 잘 지키기 위한 보강 루틴을 추천해줘`,
        level: 'intermediate', daysPerWeek: 5,
      })
      setRec(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    setLoading(true)
    try {
      await api.post('/api/routines', {
        habit: rec.habit, level: 'intermediate', daysPerWeek: 5, items: rec.routineItems,
      })
      navigate('/home')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <h2 className="text-2xl font-bold mb-1">AI 루틴 추천</h2>
      <p className="text-gray-500 text-sm mb-6">기존 습관을 기반으로 개인화된 보강 루틴을 제안해요.</p>

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        {habits.length > 0 && (
          <select value={seed} onChange={(e) => setSeed(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm">
            {habits.map((h, i) => <option key={i} value={h}>{h}</option>)}
          </select>
        )}
        <button onClick={recommend} disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg">
          {loading && !rec ? 'AI 분석 중…' : '✨ AI 추천 받기'}
        </button>
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
      </div>

      {rec && (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6 space-y-4">
          <div className="bg-purple-50 rounded-xl p-3 text-sm text-gray-600">🤖 AI 분석 결과 — {rec.habit} 보강 추천</div>
          {rec.routineItems.map((it, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4">
              <div className="font-medium">{it.title}</div>
              <p className="text-sm text-gray-500 mt-1">{it.description}</p>
              <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {it.dayOfWeek} {it.time} · {it.category}
              </span>
            </div>
          ))}
          <button onClick={save} disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg">
            추천 루틴 추가하기
          </button>
        </div>
      )}
    </AppShell>
  )
}

export default Recommend

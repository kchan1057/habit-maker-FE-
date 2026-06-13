import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { api } from '../api'

function RoutineRegister() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [level, setLevel] = useState('beginner')
  const [days, setDays] = useState(5)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  const generate = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setPreview(null)
    try {
      const res = await api.post('/api/routines/generate', {
        text, level, daysPerWeek: Number(days),
      })
      setPreview(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    setLoading(true); setError(null)
    try {
      await api.post('/api/routines', {
        habit: preview.habit, level, daysPerWeek: Number(days), items: preview.routineItems,
      })
      navigate('/home')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <h2 className="text-2xl font-bold mb-1">루틴 등록 <span className="text-purple-500 text-base">AI</span></h2>
      <p className="text-gray-500 text-sm mb-6">만들고 싶은 습관을 자연어로 편하게 입력하세요.</p>

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <select value={level} onChange={(e) => setLevel(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-sm">
            <option value="beginner">초급</option>
            <option value="intermediate">중급</option>
            <option value="advanced">고급</option>
          </select>
          <select value={days} onChange={(e) => setDays(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-sm">
            {[1,2,3,4,5,6,7].map((n) => <option key={n} value={n}>주 {n}회</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder='예: "매일 아침 7시에 30분 조깅하기"'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()}
          />
          <button onClick={generate} disabled={loading}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-5 rounded-lg font-medium">
            분석
          </button>
        </div>

        {loading && !preview && <p className="text-gray-400 text-sm">AI가 분석 중이에요…</p>}
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
      </div>

      {preview && (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-6 space-y-4">
          <h3 className="font-semibold">🧠 분석 결과 — {preview.habit}</h3>
          <div className="space-y-3">
            {preview.routineItems.map((it, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{it.title}</span>
                  <span className="text-xs text-gray-400">{it.dayOfWeek} {it.time}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{it.description}</p>
                <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {it.category} · {it.difficulty}
                </span>
              </div>
            ))}
          </div>
          {preview.tips?.length > 0 && (
            <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
              {preview.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
          <button onClick={save} disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg">
            {loading ? '저장 중…' : '이 루틴 등록하기'}
          </button>
        </div>
      )}
    </AppShell>
  )
}

export default RoutineRegister

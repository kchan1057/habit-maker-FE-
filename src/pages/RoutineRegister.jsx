import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import Icon from '../components/Icon'
import { api } from '../api'

const LEVELS = [['beginner', '초급'], ['intermediate', '중급'], ['advanced', '고급']]

export default function RoutineRegister() {
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
    try { setPreview(await api.post('/api/routines/generate', { text, level, daysPerWeek: Number(days) })) }
    catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  const save = async () => {
    setLoading(true); setError(null)
    try {
      await api.post('/api/routines', { habit: preview.habit, level, daysPerWeek: Number(days), items: preview.routineItems })
      navigate('/home')
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <AppShell>
      <header className="mb-8">
        <p className="sub mb-1 flex items-center gap-1.5"><Icon name="spark" size={15} /> AI가 습관을 루틴으로 설계해요</p>
        <h1 className="h-page text-3xl">루틴 등록</h1>
      </header>

      <div className="grid grid-cols-12 gap-5">
        {/* 입력 패널 */}
        <div className="col-span-12 lg:col-span-5 card p-6 h-fit">
          <label className="label">어떤 습관을 만들고 싶으세요?</label>
          <textarea
            className="field min-h-[96px] resize-none"
            placeholder='예) 매일 아침 7시에 30분 조깅하기'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="label">난이도</label>
              <select className="field" value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">주당 빈도</label>
              <select className="field" value={days} onChange={(e) => setDays(e.target.value)}>
                {[1,2,3,4,5,6,7].map((n) => <option key={n} value={n}>주 {n}회</option>)}
              </select>
            </div>
          </div>
          <button onClick={generate} disabled={loading || !text.trim()} className="btn-primary w-full mt-5">
            <Icon name="spark" size={18} /> {loading && !preview ? 'AI 분석 중…' : 'AI 루틴 생성'}
          </button>
          {error && <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>}
        </div>

        {/* 미리보기 */}
        <div className="col-span-12 lg:col-span-7">
          {!preview ? (
            <div className="card p-6 h-full min-h-[260px] grid place-items-center text-center">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-soft text-brand grid place-items-center mx-auto mb-3">
                  <Icon name="spark" size={22} />
                </div>
                <p className="text-ink-muted">왼쪽에 습관을 입력하면<br />여기에 AI 루틴 미리보기가 나와요</p>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">{preview.habit}</h2>
                <span className="chip-green"><Icon name="spark" size={13} /> AI 추천</span>
              </div>
              <ul className="space-y-2.5">
                {preview.routineItems.map((it, i) => (
                  <li key={i} className="border border-line rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{it.title}</span>
                      <span className="text-xs text-ink-faint">{it.dayOfWeek} {it.time}</span>
                    </div>
                    <p className="text-sm text-ink-muted mt-1.5">{it.description}</p>
                    <div className="flex gap-1.5 mt-2.5">
                      <span className="chip-mute">{it.category}</span>
                      <span className="chip-mute">{it.difficulty}</span>
                    </div>
                  </li>
                ))}
              </ul>
              {preview.tips?.length > 0 && (
                <div className="mt-4 bg-cream-sink rounded-xl p-4">
                  <p className="text-xs font-semibold text-ink-muted mb-1.5">실천 팁</p>
                  <ul className="text-sm text-ink-muted space-y-1 list-disc pl-4">
                    {preview.tips.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
              <button onClick={save} disabled={loading} className="btn-primary w-full mt-5">
                <Icon name="check" size={18} /> {loading ? '저장 중…' : '이 루틴으로 등록'}
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

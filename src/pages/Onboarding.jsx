import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

const MBTI_LIST = [
  'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP',
]

function Onboarding() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ mbti: '', age: '', job: '', gender: '', sleepTime: '23:30', wakeTime: '07:00' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true); setError(null)
    if (!localStorage.getItem('accessToken')) { navigate('/'); return }
    try {
      await api.patch('/api/users/me/profile', {
        mbti: form.mbti, age: parseInt(form.age, 10), job: form.job,
        gender: form.gender, sleepTime: form.sleepTime, wakeTime: form.wakeTime,
      })
      navigate('/home')
    } catch (err) { setError(err.message) } finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-cream py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="font-bold text-xl mb-2">habit<span className="text-brand">·</span>maker</div>
          <h1 className="text-2xl font-bold">기본 정보 입력</h1>
          <p className="sub mt-1">맞춤형 루틴 추천을 위해 알려주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">MBTI</label>
              <select name="mbti" value={form.mbti} onChange={handleChange} required className="field">
                <option value="">선택</option>
                {MBTI_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">나이</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} min="1" max="150" required placeholder="25" className="field" />
            </div>
          </div>

          <div>
            <label className="label">직업</label>
            <input type="text" name="job" value={form.job} onChange={handleChange} maxLength="20" required placeholder="학생, 회사원 …" className="field" />
          </div>

          <div>
            <label className="label">성별</label>
            <div className="flex gap-3">
              {[{ value: 'MALE', label: '남성' }, { value: 'FEMALE', label: '여성' }].map((opt) => (
                <label key={opt.value}
                  className={`flex-1 rounded-xl p-2.5 text-center text-sm cursor-pointer transition border ${
                    form.gender === opt.value ? 'border-brand bg-brand-soft text-brand-dark font-medium' : 'border-line text-ink-muted hover:bg-cream-sink'
                  }`}>
                  <input type="radio" name="gender" value={opt.value} checked={form.gender === opt.value} onChange={handleChange} className="sr-only" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">자는 시간</label>
              <input type="time" name="sleepTime" value={form.sleepTime} onChange={handleChange} required className="field" />
            </div>
            <div>
              <label className="label">일어나는 시간</label>
              <input type="time" name="wakeTime" value={form.wakeTime} onChange={handleChange} required className="field" />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</div>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? '저장 중…' : '시작하기'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Onboarding

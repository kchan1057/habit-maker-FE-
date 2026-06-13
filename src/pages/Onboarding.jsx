import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MBTI_LIST = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

function Onboarding() {
    const navigate = useNavigate()

    // 폼 상태 (한 객체에 모두 담기)
    const [form, setForm] = useState({
        mbti: '',
        age: '',
        job: '',
        gender: '',
        sleepTime: '23:30',
        wakeTime: '07:00',
    })

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // 공통 핸들러 — name 속성으로 어떤 필드인지 구분
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    // 제출
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            navigate('/')
            return
        }

        try {
            const res = await fetch('http://localhost:8080/api/users/me/profile', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mbti: form.mbti,
                    age: parseInt(form.age, 10),
                    job: form.job,
                    gender: form.gender,
                    sleepTime: form.sleepTime,
                    wakeTime: form.wakeTime,
                }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || `요청 실패 (${res.status})`)
            }

            // 성공 → 홈으로
            navigate('/home')
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-4">
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold mb-2">기본 정보 입력</h1>
                <p className="text-gray-500 text-sm mb-6">맞춤형 습관 추천을 위해 필요해요</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* MBTI */}
                    <div>
                        <label className="block text-sm font-medium mb-1">MBTI</label>
                        <select
                            name="mbti"
                            value={form.mbti}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="">선택해주세요</option>
                            {MBTI_LIST.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    {/* 나이 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">나이</label>
                        <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            min="1"
                            max="150"
                            required
                            placeholder="25"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    {/* 직업 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">직업</label>
                        <input
                            type="text"
                            name="job"
                            value={form.job}
                            onChange={handleChange}
                            maxLength="20"
                            required
                            placeholder="학생, 회사원..."
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    {/* 성별 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">성별</label>
                        <div className="flex gap-3">
                            {[
                                { value: 'MALE', label: '남성' },
                                { value: 'FEMALE', label: '여성' },
                            ].map(opt => (
                                <label
                                    key={opt.value}
                                    className={`flex-1 border rounded-lg p-2 text-center cursor-pointer transition ${
                                        form.gender === opt.value
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={opt.value}
                                        checked={form.gender === opt.value}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 자는/일어나는 시간 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">자는 시간</label>
                            <input
                                type="time"
                                name="sleepTime"
                                value={form.sleepTime}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">일어나는 시간</label>
                            <input
                                type="time"
                                name="wakeTime"
                                value={form.wakeTime}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                    </div>

                    {/* 에러 메시지 */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* 제출 */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition"
                    >
                        {submitting ? '저장 중...' : '시작하기'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Onboarding
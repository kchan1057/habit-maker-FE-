import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api } from '../api'

function Card({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <div className="text-3xl font-bold text-purple-600">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  )
}

function Stats() {
  const [data, setData] = useState(null)
  useEffect(() => { api.get('/api/stats').then(setData).catch(() => setData(null)) }, [])

  if (!data) return <AppShell><p className="text-gray-400">불러오는 중…</p></AppShell>

  return (
    <AppShell>
      <h2 className="text-2xl font-bold mb-4">통계 / 분석</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card label="오늘 달성률" value={`${data.overallRate}%`} />
        <Card label="최고 연속일" value={`${data.maxStreak}일`} />
        <Card label="총 포인트" value={`${data.totalPoints}P`} />
        <Card label="완료한 루틴" value={`${data.completedTasks}개`} />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="font-semibold mb-4">요일별 달성률</h3>
        <div className="flex gap-2 items-end h-32">
          {Object.entries(data.weeklyRate).map(([k, v]) => (
            <div key={k} className="flex-1 flex flex-col items-center gap-1 h-full">
              <div className="w-full flex-1 bg-gray-100 rounded-md flex items-end">
                <div className="w-full bg-purple-500 rounded-md transition-all" style={{ height: `${v}%` }} />
              </div>
              <span className="text-xs text-gray-400">{k}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold mb-4">카테고리별 비중</h3>
        {Object.keys(data.categoryRate).length === 0 ? (
          <p className="text-gray-400 text-sm">데이터가 아직 없어요.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(data.categoryRate).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-sm mb-1"><span>{k}</span><span>{v}%</span></div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default Stats

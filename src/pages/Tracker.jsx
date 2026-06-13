import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { api } from '../api'

function Tracker() {
  const [data, setData] = useState(null)
  useEffect(() => { api.get('/api/tracker').then(setData).catch(() => setData({ routines: [] })) }, [])

  return (
    <AppShell>
      <h2 className="text-2xl font-bold mb-4">66일 습관 트래커</h2>
      {!data ? (
        <p className="text-gray-400">불러오는 중…</p>
      ) : data.routines.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
          등록된 루틴이 없어요.
        </div>
      ) : (
        <div className="space-y-5">
          {data.routines.map((r) => (
            <div key={r.routineId} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">{r.habit}</span>
                <span className="text-purple-600 font-bold">{r.progressPercent}%</span>
              </div>
              <div className="grid grid-cols-11 gap-1.5">
                {r.days.map((d) => (
                  <div
                    key={d.dayIndex}
                    title={`${d.dayIndex}일차 · ${d.date}`}
                    className={`aspect-square rounded text-[9px] flex items-center justify-center ${
                      d.done ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-300'
                    }`}
                  >
                    {d.dayIndex}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm bg-purple-500 inline-block" /> 달성</span>
                <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm bg-gray-100 inline-block" /> 미달성</span>
                <span className="ml-auto">시작일 {r.startDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}

export default Tracker

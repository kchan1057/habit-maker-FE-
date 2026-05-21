import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // 사용자 정보 조회
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            navigate('/')
            return
        }

        fetch('http://localhost:8080/api/users/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('인증 실패')
                return res.json()
            })
            .then(data => {
                setUser(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                navigate('/')
            })
    }, [navigate])

    // 로그아웃
    const handleLogout = () => {
        // 1. 너 앱의 토큰 지우기
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        // 2. 카카오 세션도 끊고 우리 로그인 페이지로 돌아오게
        const KAKAO_CLIENT_ID = '524a1394cda926a5e4d741715b2d17fd'
        const LOGOUT_REDIRECT_URI = 'http://localhost:5173/'

        window.location.href =
            `https://kauth.kakao.com/oauth/logout` +
            `?client_id=${KAKAO_CLIENT_ID}` +
            `&logout_redirect_uri=${encodeURIComponent(LOGOUT_REDIRECT_URI)}`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
            {/* 헤더 */}
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">habit-maker</h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-4xl mx-auto px-6 py-10">
                {/* 환영 메시지 */}
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        안녕하세요, {user.nickname}님 👋
                    </h2>
                    <p className="text-gray-500">오늘도 좋은 습관 만들어봐요!</p>
                </section>

                {/* 사용자 정보 카드 */}
                <section className="bg-white rounded-2xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">내 프로필</h3>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {user.mbti}
            </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">나이</span>
                            <p className="font-medium mt-1">{user.age}세</p>
                        </div>
                        <div>
                            <span className="text-gray-500">직업</span>
                            <p className="font-medium mt-1">{user.job}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">자는 시간</span>
                            <p className="font-medium mt-1">{user.sleepTime?.slice(0, 5)}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">일어나는 시간</span>
                            <p className="font-medium mt-1">{user.wakeTime?.slice(0, 5)}</p>
                        </div>
                    </div>
                </section>

                {/* 습관 섹션 (Phase 2 placeholder) */}
                <section className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">나의 습관</h3>
                        <button
                            onClick={() => alert('습관 추가 기능은 곧 추가됩니다!')}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            + 습관 추가
                        </button>
                    </div>

                    {/* 빈 상태 */}
                    <div className="text-center py-12">
                        <p className="text-5xl mb-3">🎯</p>
                        <p className="text-gray-500 mb-1">아직 추가된 습관이 없어요</p>
                        <p className="text-gray-400 text-sm">
                            새 습관을 추가하고 AI가 만들어주는 루틴을 받아보세요
                        </p>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home
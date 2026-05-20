import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function OAuthCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        // 1. URL에서 토큰 파싱
        const params = new URLSearchParams(window.location.search)
        const accessToken = params.get('accessToken')
        const refreshToken = params.get('refreshToken')

        if (!accessToken) {
            console.error('토큰이 없습니다')
            navigate('/')
            return
        }

        // 2. localStorage에 저장
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        // 3. 사용자 정보 조회 + 분기
        fetch('http://localhost:8080/api/users/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('사용자 정보 조회 실패')
                return res.json()
            })
            .then(user => {
                console.log('사용자 정보:', user)
                if (user.onboardingCompleted) {
                    navigate('/home')
                } else {
                    navigate('/onboarding')
                }
            })
            .catch(err => {
                console.error('에러:', err)
                navigate('/')
            })
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <p>로그인 처리 중...</p>
        </div>
    )
}

export default OAuthCallback
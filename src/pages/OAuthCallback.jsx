import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')

    if (!accessToken) { navigate('/'); return }

    localStorage.setItem('accessToken', accessToken)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

    api.get('/api/users/me')
      .then((user) => navigate(user.onboardingCompleted ? '/home' : '/onboarding'))
      .catch(() => navigate('/'))
  }, [navigate])

  return (
    <div className="min-h-screen grid place-items-center bg-cream">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-brand-border border-t-brand animate-spin mx-auto mb-4" />
        <p className="sub">로그인 처리 중…</p>
      </div>
    </div>
  )
}

export default OAuthCallback

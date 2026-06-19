import { BASE } from '../api'

function Login() {
  const handleKakaoLogin = () => {
    window.location.href = `${BASE}/oauth2/authorization/kakao`
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      {/* 좌: 브랜드 */}
      <div className="hidden lg:flex flex-col justify-between p-14 bg-brand text-white">
        <div className="flex items-center gap-2 font-bold text-xl">
          habit<span className="opacity-70">·</span>maker
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-snug mb-4">생각을 끄고,<br />행동을 켜세요</h1>
          <p className="text-white/80 leading-relaxed">
            AI가 당신의 습관을 매일 실천 가능한 루틴으로 설계합니다.<br />
            66일, 작은 반복이 단단한 리듬이 됩니다.
          </p>
        </div>
        <p className="text-white/50 text-sm">66일 습관 형성 사이클 기반</p>
      </div>

      {/* 우: 로그인 */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center font-bold text-2xl">habit<span className="text-brand">·</span>maker</div>
          <h2 className="text-2xl font-bold mb-1">시작하기</h2>
          <p className="sub mb-8">카카오 계정으로 간편하게 로그인하세요</p>

          <button
            onClick={handleKakaoLogin}
            className="w-full font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            style={{ background: '#FEE500', color: '#191600' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3C6.99 3 3 6.2 3 10.13c0 2.53 1.71 4.75 4.28 6.01-.14.5-.9 3.1-.93 3.3 0 0-.02.16.08.22.1.06.23.01.23.01.3-.04 3.46-2.27 4.01-2.66.43.06.87.09 1.33.09 5.01 0 9-3.2 9-7.13S17.01 3 12 3z" />
            </svg>
            카카오로 시작하기
          </button>

          <p className="text-xs text-ink-faint mt-6 leading-relaxed">
            로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

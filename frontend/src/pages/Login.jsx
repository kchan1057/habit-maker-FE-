function Login() {
    const handleKakaoLogin = () => {
        // 백엔드의 카카오 OAuth 시작 URL로 이동
        window.location.href = 'https://dominion-chariot-implosive.ngrok-free.dev/oauth2/authorization/kakao'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
                <h1 className="text-4xl font-bold mb-2">habit-maker</h1>
                <p className="text-gray-500 mb-8">AI가 만들어주는 나만의 습관</p>

                <button
                    onClick={handleKakaoLogin}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                    <span>💬</span>
                    카카오로 로그인
                </button>

                <p className="text-xs text-gray-400 mt-6">
                    로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                </p>
            </div>
        </div>
    )
}

export default Login
// 백엔드 호출 공통 헬퍼. 기존 페이지들과 동일하게 localStorage 'accessToken' 사용.
const BASE = 'http://localhost:8080'

export function getToken() {
  return localStorage.getItem('accessToken')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  if (res.status === 401) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/'
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `요청 실패 (${res.status})`)
  }
  return data
}

export const api = {
  get: (p) => request(p),
  post: (p, body) =>
    request(p, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: (p, body) => request(p, { method: 'PATCH', body: JSON.stringify(body) }),
}

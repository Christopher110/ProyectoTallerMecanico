const API = import.meta.env.VITE_API_URL || 'https://localhost:55455/api/v1'

export async function api(path, opts={}){
  const token = JSON.parse(localStorage.getItem('tm.auth') || 'null')?.token
  const headers = { 'Content-Type': 'application/json', ...(opts.headers||{}) }
  if(token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, { ...opts, headers })
  if(!res.ok){
    const msg = await res.text()
    throw new Error(msg || res.statusText)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}
export async function login(email, password){
  return api('/auth/login', { method:'POST', body: JSON.stringify({ email, password }) })
}

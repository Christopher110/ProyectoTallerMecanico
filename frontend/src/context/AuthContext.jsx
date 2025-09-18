import { createContext, useContext, useEffect, useState } from 'react'

const AuthCtx = createContext(null)
const KEY = 'tm.auth'

export function AuthProvider({children}){
  const [user, setUser] = useState(null)
  useEffect(()=>{
    const raw = localStorage.getItem(KEY)
    if(raw) setUser(JSON.parse(raw))
  },[])

  function login(data){
    setUser(data)
    localStorage.setItem(KEY, JSON.stringify(data))
  }
  function logout(){
    setUser(null)
    localStorage.removeItem(KEY)
  }

  return <AuthCtx.Provider value={{user, login, logout}}>{children}</AuthCtx.Provider>
}

export function useAuth(){ return useContext(AuthCtx) }

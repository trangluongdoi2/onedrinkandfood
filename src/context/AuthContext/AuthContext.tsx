import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getAuth, User, UserInfo } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const initialAuthContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: {} as User | null | UserInfo | any
}

export const AuthContext = createContext(initialAuthContext)

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const auth = getAuth()

  const value = useMemo(() => ({ user, setUser }), [user])

  useEffect(() => {
    const unsubcribed = auth.onAuthStateChanged((user: any) => {
      if (user?.uid) {
        setUser(user)
        localStorage.setItem('accessToken', user.accessToken)
        return
      }

      setUser(null)
      localStorage.clear()
      navigate('/login')
    })

    return () => {
      unsubcribed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)

export default AuthProvider

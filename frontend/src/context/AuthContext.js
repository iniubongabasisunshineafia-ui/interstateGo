import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // set axios base url
 axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
 
 
  useEffect(() => {
    // check if user is logged in on app load
    const storedUser = localStorage.getItem('interstategoUser')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('interstategoUser', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('interstategoUser')
    delete axios.defaults.headers.common['Authorization']
  }

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('interstategoUser', JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
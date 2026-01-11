import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

// Helper function to load user from localStorage
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error('Error parsing stored user:', error)
    localStorage.removeItem('user')
    return null
  }
}

export const UserProvider = ({ children }) => {
  // Initialize state directly from localStorage (lazy initialization)
  const [user, setUser] = useState(() => loadUserFromStorage())
  // const [loading, setLoading] = useState(false)

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

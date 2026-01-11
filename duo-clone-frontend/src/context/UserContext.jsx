// Helper functions for user management without Context API
export const getUser = () => {
  try {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error('Error parsing stored user:', error)
    localStorage.removeItem('user')
    return null
  }
}

export const saveUser = (userData) => {
  const userToSave = {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    userId: userData.userId,
    createdAt: userData.createdAt
  }
  localStorage.setItem('user', JSON.stringify(userToSave))
}

export const removeUser = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

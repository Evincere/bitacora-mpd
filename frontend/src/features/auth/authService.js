import axios from 'axios'

const API_URL = '/api/auth'

// Login
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData)
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  
  return response.data
}

// Logout
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  login,
  logout
}

export default authService

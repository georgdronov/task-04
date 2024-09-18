import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
    return response.data.isAuthenticated;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check authentication');
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

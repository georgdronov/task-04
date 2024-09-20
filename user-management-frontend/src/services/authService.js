import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL + "/api/auth";

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, credentials);
    const token = response.data.token;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axios.get(`${apiUrl}/check-auth`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    if (response.data.isAuthenticated) {
      return true;
    } else {
      localStorage.removeItem("token");
      return false;
    }
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return false;
  }
};

export const logout = async () => {
  try {
    await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });

    localStorage.removeItem("token");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};

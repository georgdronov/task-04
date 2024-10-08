import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL + "/api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      localStorage.removeItem("token"); // Удаляем токен при любой ошибке
      if (err.response && err.response.status === 404) {
        setError("User not found");
      } else if (err.response && err.response.status === 401) {
        setError("Invalid password");
      } else if (err.response && err.response.status === 403) {
        setError("You are blocked. Please contact your administrator.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      {error && <p className="text-danger text-center">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

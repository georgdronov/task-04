import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || "/api/auth";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register`, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      setSuccess("Registration successful");
      navigate("/dashboard");
    } catch (err) {
      localStorage.removeItem("token"); // Удаляем токен при ошибке
      if (err.response && err.response.status === 409) {
        setError("User already exists");
      } else {
        setError("Registration failed. Please try again later.");
      }
      console.error(
        "Error:",
        err.response ? err.response.data.message : err.message
      );
    }
  };

  return (
    <div>
      {error && <p className="text-danger text-center">{error}</p>}
      {success && <p className="text-success text-center">{success}</p>}
      <form onSubmit={handleRegister}>
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
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;

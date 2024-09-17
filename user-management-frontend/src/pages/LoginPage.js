import React from 'react';
import Login from '../components/Login';

const LoginPage = () => {
  const handleLoginSuccess = () => {
    window.location.href = '/dashboard'; 
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="w-50 p-4 shadow-lg rounded">
        <h1 className="text-center mb-4">Login</h1>
        <Login onLogin={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;

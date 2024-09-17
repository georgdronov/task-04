import React from 'react';
import Login from '../components/Login';

const LoginPage = () => {
  const handleLoginSuccess = () => {
    window.location.href = '/dashboard'; 
  };

  return (
    <div className="container">
      <h1  className="text-center">Login Page</h1>
      <Login onLogin={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;

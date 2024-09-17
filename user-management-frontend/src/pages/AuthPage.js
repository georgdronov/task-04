import React, { useState } from "react";
import Login from "../components/Login";
import RegistrationForm from "../components/RegistrationForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  if (isLogin === null || isLogin === undefined) {
    throw new Error("isLogin is null or undefined");
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="border rounded p-4 bg-white shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h1>
        {isLogin ? (
          <>
            <Login />
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <a href="#" onClick={() => setIsLogin(false)} className="text-primary">
                Register
              </a>
            </p>
          </>
        ) : (
          <>
            <RegistrationForm />
            <p className="text-center mt-3">
              Already have an account?{" "}
              <a href="#" onClick={() => setIsLogin(true)} className="text-primary">
                Login
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

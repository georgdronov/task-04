import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import RegistrationForm from "../components/RegistrationForm";
import Loading from "../components/Loading";
import { isAuthenticated } from "../services/authService";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        if (auth) {
          console.log("User is authenticated. Redirecting to /dashboard");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Failed to check authentication", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="border rounded p-4 bg-white shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h1>
        {isLogin ? (
          <>
            <Login />
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={() => setIsLogin(false)}
                className="text-primary"
              >
                Register
              </a>
            </p>
          </>
        ) : (
          <>
            <RegistrationForm />
            <p className="text-center mt-3">
              Already have an account?{" "}
              <a
                href="#"
                onClick={() => setIsLogin(true)}
                className="text-primary"
              >
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

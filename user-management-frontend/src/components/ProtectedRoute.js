import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const apiUrl = process.env.REACT_APP_API_URL + "/api/auth";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthentication = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuthenticated(response.data.isAuthenticated);
    } catch (error) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

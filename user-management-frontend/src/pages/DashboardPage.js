import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import { isAuthenticated } from "../services/authService"; // Keep this
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated();
        console.log("Is authenticated:", isAuth);
        if (!isAuth) {
          navigate("/auth");
        } else {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!authenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Management Dashboard</h1>
      <UserTable />
    </div>
  );
};

export default DashboardPage;

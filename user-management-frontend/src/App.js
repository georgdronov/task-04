import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/Login";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/dashboard" Component={DashboardPage} />
      </Routes>
    </Router>
  );
};

export default App;

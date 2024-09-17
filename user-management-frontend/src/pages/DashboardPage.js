import React from "react";
import UserTable from "../components/UserTable";

const DashboardPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Management Dashboard</h1>
      <UserTable />
    </div>
  );
};

export default DashboardPage;

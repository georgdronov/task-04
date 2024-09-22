import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL + "/api";
console.log("API URL:", apiUrl);

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [previousUsers, setPreviousUsers] = useState([]);
  const navigate = useNavigate();

  const localToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        console.log("Fetched users:", response.data);

        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setPreviousUsers(response.data);
        } else {
          console.error("Unexpected data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    users.forEach((user) => {
      if (
        (user.status === "deleted" || user.status === "blocked") &&
        user.token === localToken
      ) {
        console.log("Redirecting deleted or blocked user with matching token");
        navigate("/login");
      }
    });
  }, [users, localToken, navigate]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleAction = async (action) => {
    let usersToLog = [];

    if (action === "delete") {
      usersToLog = users.filter((user) => selectedUsers.includes(user.id));
    }

    try {
      await axios.post(`${apiUrl}/admin/${action}-users`, {
        userIds: selectedUsers,
      });

      const response = await axios.get(`${apiUrl}/users`);
      setUsers(response.data);
      setSelectedUsers([]);
      setSelectAll(false);

      console.log(`Action: ${action} performed.`);

      if (action === "delete") {
        usersToLog.forEach((deletedUser) => {
          console.log(
            `Deleted User Email: ${deletedUser.email}, Status: ${deletedUser.status}, Token: ${deletedUser.token}`
          );
        });
      } else {
        response.data.forEach((newUser) => {
          const prevUser = previousUsers.find((user) => user.id === newUser.id);
          if (prevUser && prevUser.status !== newUser.status) {
            console.log(
              `User Email: ${newUser.email}, Status: ${newUser.status}, Token: ${newUser.token}`
            );
          }
        });
      }

      setPreviousUsers(response.data);
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-3 d-flex justify-content-end gap-2">
        <button
          onClick={() => handleAction("block")}
          className="btn btn-warning"
        >
          Block
        </button>
        <button
          onClick={() => handleAction("unblock")}
          className="btn btn-success"
        >
          Unblock
        </button>
        <button
          onClick={() => handleAction("delete")}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label style={{ marginLeft: "12px" }}>Select all</label>
            </th>
            <th scope="col">Email</th>
            <th scope="col">Registration Date</th>
            <th scope="col">Last Login</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>{user.email}</td>
                <td>{user.registration_date}</td>
                <td>{user.last_login}</td>
                <td>{user.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = "https://task04production.up.railway.app";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users`);
        setUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate("/login");
        } else {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUsers();
  }, [navigate]);

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
    try {
      await axios.post(`${apiUrl}/api/admin/${action}-users`, {
        userIds: selectedUsers,
      });
      const response = await axios.get(`${apiUrl}/api/users`);
      setUsers(response.data);
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
          {users.map((user) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

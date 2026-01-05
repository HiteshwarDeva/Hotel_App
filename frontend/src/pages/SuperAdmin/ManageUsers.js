import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axiosInstance.get("/superadmin/manage-users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/superadmin/manage-users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <h2>All Users</h2>
      {users.length === 0 ? <p>No users</p> : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => handleDelete(u._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

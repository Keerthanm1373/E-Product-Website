import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navigation/Navbar";

function UpdateRoles() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const isTokenExpired = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    return Date.now() > expiry;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      if (isTokenExpired(token)) {
        console.log("Token expired");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        
        const response = await fetch(`${BASE_URL}/web/roles-assign`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log("Unauthorized: Redirecting to login");
            localStorage.removeItem("token");
            navigate("/login");
          }
          throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, BASE_URL]);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerTerm) ||
          user.email.toLowerCase().includes(lowerTerm)
      )
    );
  }, [searchTerm, users]);

  const handleRoleChange = async (email, newRole) => {
    const token = localStorage.getItem("token");
    const user = users.find((u) => u.email === email);
    if (!user) return;

    const updatedUser = { ...user, roles: newRole };

    try {
      const response = await fetch(`${BASE_URL}/web/roles-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      alert("Role updated successfully");
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, roles: newRole } : u))
      );
    } catch (error) {
      console.error("Role update error:", error);
      alert("Error updating role");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Manage User Roles</h2>

        <input
          type="text"
          placeholder="Search by username or email..."
          className="w-full px-4 py-2 border rounded-lg mb-6"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading ? (
          <div className="text-center py-12 text-gray-600">Loading users...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Current Role</th>
                  <th className="px-4 py-2">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.email} className="text-center border-t">
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.roles}</td>
                      <td className="px-4 py-2">
                        <select
                          value={user.roles}
                          onChange={(e) =>
                            handleRoleChange(user.email, e.target.value)
                          }
                          className="border px-2 py-1 rounded"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateRoles;

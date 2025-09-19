// src/pages/AdminUsers.tsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import AddUserDialog from "../components/AddUserDialog";
import EditUserDialog from "../components/EditUserDialog"; // ✅ import it

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "❌ Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("✅ User deleted");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "❌ Failed to delete user");
    }
  };

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <AddUserDialog onAdded={fetchUsers} />
      </header>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border">
          <table className="min-w-full bg-white text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Created</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border capitalize">{user.role}</td>
                    <td className="p-3 border">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 border flex gap-2">
                      <EditUserDialog user={user} onUpdated={fetchUsers} />
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

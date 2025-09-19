// src/components/EditUserDialog.tsx
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-hot-toast";
import api from "../utils/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  user: User;
  onUpdated: () => void;
}

export default function EditUserDialog({ user, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/admin/users/${user._id}`, form);
      toast.success("✅ User updated");
      setOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "❌ Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
          Edit
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 space-y-4">
          <Dialog.Title className="text-lg font-bold">Edit User</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

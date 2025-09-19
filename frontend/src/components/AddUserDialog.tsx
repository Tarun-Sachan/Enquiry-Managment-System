// src/components/AddUserDialog.tsx
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-hot-toast";
import api from "../utils/api";

export default function AddUserDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!form.name || !form.email || !form.password) throw new Error("All fields are required");
      await api.post("/admin/users", form);
      toast.success("User created");
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "user" });
      onAdded();
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Add User
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">Add New User</Dialog.Title>

          <div className="space-y-3">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close className="px-4 py-2 rounded bg-gray-100">Cancel</Dialog.Close>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import api from "../utils/api";
import { clearAuth, getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import AddEnquiryForm from "../components/AddEnquiryForm";
import EditEnquiryModal from "../components/EditEnquiryModal";

type Enquiry = {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: "open" | "in-progress" | "closed";
  assignedTo?: { _id: string; name?: string; email?: string } | null;
  createdBy?: { _id: string; name?: string; email?: string } | null;
  createdAt?: string;
};

export default function Dashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [editing, setEditing] = useState<Enquiry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Enquiry | null>(null);
  const navigate = useNavigate();

  // Fetch enquiries
  const fetchEnquiries = async (status?: string) => {
    setLoading(true);
    try {
      const params: any = {};
      if (status && status !== "all") params.status = status === "new" ? "open" : status;
      if (search) params.search = search;
      const res = await api.get("/enquiries", { params });
      setEnquiries(res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const statusMap: Record<string, string | undefined> = {
      all: undefined,
      new: "open",
      "in-progress": "in-progress",
      closed: "closed",
    };
    fetchEnquiries(statusMap[activeTab]);
  }, [activeTab, search]);

  const filtered = useMemo(() => {
    if (!search) return enquiries;
    const s = search.toLowerCase();
    return enquiries.filter(
      (e) =>
        e.customerName.toLowerCase().includes(s) ||
        e.email.toLowerCase().includes(s) ||
        e.phone.toLowerCase().includes(s) ||
        e.message.toLowerCase().includes(s)
    );
  }, [enquiries, search]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const handleView = (e: Enquiry) => setSelected(e);
  const handleEdit = (e: Enquiry) => setEditing(e);
  const handleDelete = async (e: Enquiry) => {
    try {
      await api.delete(`/enquiries/${e._id}`);
      toast.success("Enquiry deleted");
      setEnquiries((prev) => prev.filter((x) => x._id !== e._id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleSaveEdit = async (payload: Partial<Enquiry> & { _id: string }) => {
    try {
      const res = await api.put(`/enquiries/${payload._id}`, payload);
      toast.success("Enquiry updated");
      setEnquiries((prev) => prev.map((p) => (p._id === payload._id ? res.data : p)));
      setEditing(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // Determine role from token (or API)
  const userRole = getToken()?.role || "user"; // assuming your token decoding returns role

  return (
    <div className="p-6 min-h-screen bg-gray-50 animate-fadeIn">
      <header className="flex items-center justify-between mb-6 bg-white shadow-md p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-1 md:mb-0">Enquiries Dashboard</h1>
            <p className="text-gray-500 text-sm md:text-base">Overview of customer enquiries</p>
          </div>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mt-2 mb-6 md:mt-0">
        <AddEnquiryForm onAdded={fetchEnquiries} />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-1/2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => fetchEnquiries(undefined)}
              className="px-3 py-2 bg-gray-100 rounded-lg border"
              title="Refresh"
            >
              Refresh
            </button>
          </div>

          <Tabs.Root
            value={activeTab}
            onValueChange={(v) => setActiveTab(v)}
            className="flex gap-2"
          >
            <Tabs.List aria-label="Enquiry tabs" className="flex gap-2">
              <Tabs.Trigger value="all" className="px-3 py-2 rounded-full text-sm bg-white border shadow-sm">All</Tabs.Trigger>
              <Tabs.Trigger value="new" className="px-3 py-2 rounded-full text-sm bg-white border shadow-sm">Open</Tabs.Trigger>
              <Tabs.Trigger value="in-progress" className="px-3 py-2 rounded-full text-sm bg-white border shadow-sm">In Progress</Tabs.Trigger>
              <Tabs.Trigger value="closed" className="px-3 py-2 rounded-full text-sm bg-white border shadow-sm">Closed</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Assigned</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-sm text-gray-500">Loading…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-sm text-gray-500">No enquiries found.</td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{e.customerName}</div>
                      <div className="text-xs text-gray-500">{new Date(e.createdAt || "").toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{e.email}</div>
                      <div className="text-xs text-gray-500">{e.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          e.status === "open"
                            ? "bg-green-100 text-green-800"
                            : e.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {e.assignedTo ? (
                        <div>
                          <div className="text-sm">{e.assignedTo.name}</div>
                          <div className="text-sm">{e.assignedTo.email}</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">—</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(e)}
                          className="px-3 py-1 rounded text-sm bg-blue-50 text-blue-700 border"
                        >
                          View
                        </button>
                        {/* <EditEnquiryModal enquiry={e} onUpdated={fetchEnquiries} /> */}
                        <button
                          onClick={() => handleEdit(e)}
                          className="px-3 py-1 rounded text-sm bg-yellow-50 text-yellow-700 border"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDelete(e)}
                          className="px-3 py-1 rounded text-sm bg-red-50 text-red-700 border"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog.Root open={!!selected} onOpenChange={() => setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-[90%] max-w-xl shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-2">Enquiry Details</Dialog.Title>
            {selected && (
              <div className="space-y-2">
                <div><strong>Customer:</strong> {selected.customerName}</div>
                <div><strong>Email:</strong> {selected.email}</div>
                <div><strong>Phone:</strong> {selected.phone}</div>
                <div><strong>Status:</strong> {selected.status}</div>
                <div>
                  <strong>Message:</strong>
                  <div className="mt-2 p-3 bg-gray-50 rounded">{selected.message}</div>
                </div>
              </div>
            )}
            <div className="mt-4 text-right">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded bg-gray-100">
                Close
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit Dialog */}
      <Dialog.Root open={!!editing} onOpenChange={() => setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-[95%] max-w-lg shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-2">Edit Enquiry</Dialog.Title>
            {editing && (
              <EditForm
                initial={editing}
                onCancel={() => setEditing(null)}
                onSave={handleSaveEdit}
                userRole={userRole} // ✅ pass userRole
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Dialog */}
      <Dialog.Root open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <Dialog.Title className="text-lg font-semibold">Delete Enquiry</Dialog.Title>
            <p className="mt-3 text-sm text-gray-600">Are you sure you want to delete this enquiry? This is a soft delete.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
              <button
                onClick={() => confirmDelete && handleDelete(confirmDelete)}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

// ---------- EditForm component ----------
function EditForm({
  initial,
  onCancel,
  onSave,
  userRole,
}: {
  initial: Enquiry;
  onCancel: () => void;
  onSave: (p: Partial<Enquiry> & { _id: string }) => void;
  userRole: string;
}) {
  const [customerName, setCustomerName] = useState(initial.customerName);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [status, setStatus] = useState(initial.status);
  const [message, setMessage] = useState(initial.message);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onSave({ _id: initial._id, customerName, email, phone, status, message });
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Customer</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="mt-1 w-full p-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Status</label>
        {userRole === "admin" ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="mt-1 w-full p-2 border rounded"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        ) : (
          <input
            value={status}
            disabled
            className="mt-1 w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full p-2 border rounded"
          rows={4}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

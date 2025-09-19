import { useState, useEffect } from "react";
import * as Select from "@radix-ui/react-select";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import AdminNavbar from "../components/AdminNavbar";

interface Enquiry {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

interface Staff {
  _id: string;
  name: string;
  email: string;
   role: string; 
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [staffUsers, setStaffUsers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get("/enquiries");
      setEnquiries(res.data);
    } catch {
      toast.error("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get("/admin/users");
      setStaffUsers(res.data.filter((u: Staff) => u.role === "staff"));
    } catch {
      toast.error("Failed to fetch staff");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/enquiries/${id}`, { status });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status } : e))
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleAssign = async (id: string, staffId: string | null) => {
    try {
      const assignedTo = staffId === "" ? null : staffId;
      await api.put(`/enquiries/${id}`, { assignedTo });
      setEnquiries((prev) =>
        prev.map((e) =>
          e._id === id
            ? {
                ...e,
                assignedTo:
                  staffUsers.find((s) => s._id === staffId) || null,
              }
            : e
        )
      );
      toast.success("Assigned successfully");
    } catch {
      toast.error("Failed to assign");
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchStaff();
  }, []);

  return (
    <div className="p-6">
       <AdminNavbar />
      <h1 className="text-2xl font-bold mb-6">Enquiries Management</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Assigned</th>
            
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-sm text-gray-500"
                >
                  Loading…
                </td>
              </tr>
            ) : enquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-sm text-gray-500"
                >
                  No enquiries found.
                </td>
              </tr>
            ) : (
              enquiries.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50">
                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-medium">{e.customerName}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(e.createdAt || "").toLocaleString()}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3">
                    <div className="text-sm">{e.email}</div>
                    <div className="text-xs text-gray-500">{e.phone}</div>
                  </td>

                  {/* Status */}
              <td className="px-4 py-3">
  <Select.Root
    value={e.status}
    onValueChange={(val) => handleStatusChange(e._id, val)}
  >
    <Select.Trigger className="inline-flex w-36 items-center justify-between rounded border px-2 py-1 text-sm">
      <Select.Value placeholder="Select status" />
    </Select.Trigger>
    <Select.Content className="bg-white border rounded shadow">
      <Select.Item
        value="open"
        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      >
        <Select.ItemText>Open</Select.ItemText>
      </Select.Item>
      <Select.Item
        value="in-progress"
        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      >
        <Select.ItemText>In Progress</Select.ItemText>
      </Select.Item>
      <Select.Item
        value="closed"
        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      >
        <Select.ItemText>Closed</Select.ItemText>
      </Select.Item>
    </Select.Content>
  </Select.Root>
</td>

                  {/* Assigned */}
               <td className="px-4 py-3">
  <Select.Root
    value={e.assignedTo?._id || "unassigned"}
    onValueChange={(val) =>
      handleAssign(e._id, val === "unassigned" ? null : val)
    }
  >
    <Select.Trigger className="inline-flex w-48 items-center justify-between rounded border px-2 py-1 text-sm">
      <Select.Value placeholder="Unassigned" />
    </Select.Trigger>
    <Select.Content className="bg-white border rounded shadow max-h-60 overflow-y-auto">
      <Select.Item
        value="unassigned"
        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      >
        <Select.ItemText>Unassigned</Select.ItemText>
      </Select.Item>
      {staffUsers.map((s) => (
        <Select.Item
          key={s._id}
          value={s._id}
          className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
        >
          <Select.ItemText>{s.name} ({s.email})</Select.ItemText>
        </Select.Item>
      ))}
    </Select.Content>
  </Select.Root>
</td>

               
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// src/components/EditEnquiryModal.tsx
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-hot-toast";
import api from "../utils/api";

type Props = {
  enquiry: any;
  onUpdated: () => void;
};

export default function EditEnquiryModal({ enquiry, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(enquiry.status);
  const [assignedTo, setAssignedTo] = useState(enquiry.assignedTo?._id || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/enquiries/${enquiry._id}`, { status, assignedTo });
      toast.success("Enquiry updated");
      onUpdated();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded border text-sm">
        Edit
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg animate-fadeIn">
          <Dialog.Title className="text-lg font-semibold mb-3">Edit Enquiry</Dialog.Title>

          <div className="space-y-3">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            <input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Assign to User ID"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Dialog.Close className="px-4 py-2 rounded bg-gray-100">Cancel</Dialog.Close>
            <button onClick={handleSave} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

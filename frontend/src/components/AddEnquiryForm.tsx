import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { createEnquirySchema } from "../validators/enquiryValidator";
import type { CreateEnquiryInput } from "../validators/enquiryValidator";
import { ZodError } from "zod";

export default function AddEnquiryForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Omit<CreateEnquiryInput, "assignedTo">>({
    customerName: "",
    email: "",
    phone: "",
    message: "",
    status: "open",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // reset error on change
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    try {
      createEnquirySchema.parse(form);
      setLoading(true);
      await api.post("/enquiries", form);
      toast.success("Enquiry added successfully");
      onAdded();
      setOpen(false);
      setForm({ customerName: "", email: "", phone: "", message: "", status: "open" });
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof typeof form, string>> = {};
        (err.issues as Array<{ path: (string | number)[]; message: string }>).forEach((e) => {
          const key = typeof e.path[0] === "string" ? (e.path[0] as keyof typeof form) : undefined;
          if (key) {
            fieldErrors[key] = fieldErrors[key] ? `${fieldErrors[key]} ${e.message}` : e.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form");
      } else if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-ignore
        toast.error(err.response?.data?.message || "Failed to add enquiry");
      } else {
        toast.error("Failed to add enquiry");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Add Enquiry
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-[90%] max-w-lg shadow-lg animate-fadeIn">
          <Dialog.Title className="text-lg font-semibold mb-4">Add New Enquiry</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Name */}
            <div>
              {errors.customerName && (
                <div className="mb-1">
                  <span className="text-red-500 text-sm">{errors.customerName}</span>
                </div>
              )}
              <input
                name="customerName"
                placeholder="Customer Name"
                value={form.customerName}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.customerName ? "border-red-500" : ""}`}
                aria-invalid={!!errors.customerName}
                aria-describedby={errors.customerName ? "customerName-error" : undefined}
              />
            </div>

            {/* Email */}
            <div>
              {errors.email && (
                <div className="mb-1">
                  <span className="text-red-500 text-sm">{errors.email}</span>
                </div>
              )}
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : ""}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>

            {/* Phone */}
            <div>
              {errors.phone && (
                <div className="mb-1">
                  <span className="text-red-500 text-sm">{errors.phone}</span>
                </div>
              )}
              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.phone ? "border-red-500" : ""}`}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </div>

            {/* Message */}
            <div>
              {errors.message && (
                <div className="mb-1">
                  <span className="text-red-500 text-sm">{errors.message}</span>
                </div>
              )}
              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.message ? "border-red-500" : ""}`}
                rows={4}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
            </div>

            {/* Status (disabled) */}
            <select
              name="status"
              disabled
              value={form.status}
              className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close type="button" className="px-4 py-2 rounded bg-gray-100">Cancel</Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {loading ? "Adding..." : "Add Enquiry"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

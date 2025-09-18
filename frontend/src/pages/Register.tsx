import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        name: username,
        email,
        password,
      });

      toast.success("✅ Registration successful! Please login.");
      console.log("Registered:", res.data);

      setTimeout(() => navigate("/login"), 1000);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "❌ Registration failed. Try again.";
      toast.error(message);
      console.error("Register error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 animate-fadeIn">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>

        {/* Username */}
        <div className="flex flex-col space-y-2">
          <Label.Root htmlFor="username" className="text-sm font-medium text-gray-700">
            Username
          </Label.Root>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter username"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-2">
          <Label.Root htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label.Root>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter email"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col space-y-2">
          <Label.Root htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label.Root>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter password"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-transform transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Register
        </button>

        {/* Link to login */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

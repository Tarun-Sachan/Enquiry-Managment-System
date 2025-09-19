import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import toast from "react-hot-toast";
import api from "../utils/api";
import { setAuth } from "../utils/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const res = await api.post("/auth/login", {
  //       email:username,
  //       password,
  //     });

  //     // Save token in localStorage
  //     setToken(res.data.token, true);

  //     toast.success("✅ Login successful!");
  //     setTimeout(() => navigate("/dashboard"), 1000);
  //   } catch (err: any) {
  //     const message =
  //       err.response?.data?.message || "❌ Invalid credentials. Try again.";
  //     toast.error(message);
  //     console.error("Login error:", err.response?.data || err.message);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", {
      email: username,
      password,
    });

    // Save token and user role
    const { token, user } = res.data;
    setAuth(token,user, true);

    toast.success("✅ Login successful!");
   
    // Redirect based on role
    switch (user.role) {
      case "admin":
        navigate("/admin/users");
        break;
      case "user":
      default:
        navigate("/dashboard");
        break;
    }
  } catch (err: any) {
    const message =
      err.response?.data?.message || "❌ Invalid credentials. Try again.";
    toast.error(message);
    console.error("Login error:", err.response?.data || err.message);
  }
};
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 animate-fadeIn">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

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
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
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
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Login
        </button>

        {/* Link to register */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

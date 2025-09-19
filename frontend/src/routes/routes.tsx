import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AdminUsers from "../pages/AdminUsers";
import ProtectedRoute from './ProtectedRoutes';
import AdminEnquiries from "../pages/AdminEnquiries.tsx";

// export const appRoutes: AppRoute[] = [
//   { path: '/login', element: <Login /> },
//   { path: '/register', element: <Register /> },
//   {
//     path: '/dashboard',
//     element: (
//       <ProtectedRoute>
//         <Dashboard />
//       </ProtectedRoute>
//     ),
//     protected: true,
//   },
// ];
export const appRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["user", "staff"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminUsers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/enquiries",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminEnquiries />
      </ProtectedRoute>
    ),
    protected: true,
  },
];

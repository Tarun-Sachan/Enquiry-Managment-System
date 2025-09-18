import { clearToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded mt-4">
        Logout
      </button>
    </div>
  );
}

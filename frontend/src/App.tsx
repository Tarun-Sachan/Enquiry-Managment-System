import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { appRoutes } from './routes/routes';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
        {/* Fallback → redirect to login if no match */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ComoFunciona from "./pages/ComoFunciona";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Error400 from "./pages/errors/400";
import Error401 from "./pages/errors/401";
import Error403 from "./pages/errors/403";
import Error404 from "./pages/errors/404";

export const GlobalNav = { navigate: null as any };

export default function App() {
  const navigate = useNavigate();
  GlobalNav.navigate = navigate;

  return (
    <Routes>
      <Route path="/" element={<ComoFunciona />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/400" element={<Error400 />} />
      <Route path="/401" element={<Error401 />} />
      <Route path="/403" element={<Error403 />} />
      <Route path="/404" element={<Error404 />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
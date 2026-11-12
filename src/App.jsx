import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintsProvider } from './context/ComplaintsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllComplaints from './pages/AllComplaints';
import MyComplaints from './pages/MyComplaints';
import ManageComplaints from './pages/ManageComplaints';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ComplaintsProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* both students and admins */}
            <Route
              path="/complaints"
              element={<ProtectedRoute><AllComplaints /></ProtectedRoute>}
            />

            {/* students only */}
            <Route
              path="/my-complaints"
              element={<ProtectedRoute role="student"><MyComplaints /></ProtectedRoute>}
            />

            {/* admin only */}
            <Route
              path="/admin/manage"
              element={<ProtectedRoute role="admin"><ManageComplaints /></ProtectedRoute>}
            />
            <Route
              path="/admin/analytics"
              element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>}
            />
          </Routes>
        </ComplaintsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
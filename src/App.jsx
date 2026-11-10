import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintsProvider } from './context/ComplaintsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllComplaints from './pages/AllComplaints';
import MyComplaints from './pages/MyComplaints';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ComplaintsProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/complaints"
              element={<ProtectedRoute role="student"><AllComplaints /></ProtectedRoute>}
            />
            <Route
              path="/my-complaints"
              element={<ProtectedRoute role="student"><MyComplaints /></ProtectedRoute>}
            />
          </Routes>
        </ComplaintsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
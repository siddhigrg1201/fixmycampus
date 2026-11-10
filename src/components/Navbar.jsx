import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="brand">
        <img src={logo} alt="IGDTUW" />
        <div>
          <strong>IGDTUW</strong>
          <small>INDIRA GANDHI DELHI TECHNICAL UNIVERSITY FOR WOMEN</small>
        </div>
      </div>

      {user ? (
        <>
          <nav className="nav-links">
            {user.role === 'student' && (
              <>
                <NavLink to="/complaints">All Complaints</NavLink>
                <NavLink to="/my-complaints">My Complaints</NavLink>
              </>
            )}
          </nav>

          <div className="nav-actions">
            <button
              className="btn btn-outline"
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </>
      ) : (
        <div className="nav-actions">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/signup" className="btn btn-solid">Sign Up</Link>
        </div>
      )}
    </header>
  );
}
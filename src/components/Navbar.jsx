import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <img src={logo} alt="IGDTUW" />
        <div>
          <strong>IGDTUW</strong>
          <small>INDIRA GANDHI DELHI TECHNICAL UNIVERSITY FOR WOMEN</small>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/report">Report Issue</NavLink>
        <NavLink to="/track">Track Complaints</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <div className="nav-actions">
        <Link to="/login" className="btn btn-outline">Login</Link>
        <Link to="/signup" className="btn btn-solid">Sign Up</Link>
      </div>
    </header>
  );
}
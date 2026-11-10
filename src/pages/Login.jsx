import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = role === 'admin';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    const result = login({ email: form.email, password: form.password, role });
    if (!result.ok) {
      setError(result.error);
    }
    // on success, `user` is set and the redirect below takes over
  };

  // Already logged in (or just logged in): go to the right page
  if (user) {
    return <Navigate to={user.role === 'student' ? '/complaints' : '/'} replace />;
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-sub">
          {isAdmin
            ? 'Log in to manage and resolve campus complaints.'
            : 'Log in to report and track campus issues.'}
        </p>

        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => switchRole('student')}
          >
            <GraduationCap size={17} /> Student
          </button>
          <button
            type="button"
            className={`role-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => switchRole('admin')}
          >
            <ShieldCheck size={17} /> Admin
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <div className="input-box">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder={isAdmin ? 'admin@example.com' : 'you@example.com'}
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-box">
              <Lock size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-solid submit-btn">
            {isAdmin ? 'Log In as Admin' : 'Log In'}
          </button>
        </form>

        {isAdmin ? (
          <p className="admin-note">
            Admin accounts are created by the system administrator.
          </p>
        ) : (
          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Hardcoded admin account (change these if you like)
const ADMIN = {
  id: 'admin-1',
  name: 'Campus Admin',
  email: 'admin@fixmycampus.com',
  password: 'admin123',
  role: 'admin',
};

const USERS_KEY = 'fmc_users';
const SESSION_KEY = 'user';

function readStudents() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // never keep the password in the logged-in session
  const startSession = (account) => {
    const session = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    };
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  };

  // Creates a student account and logs them in
  const signup = ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const students = readStudents();

    const exists =
      cleanEmail === ADMIN.email || students.some((s) => s.email === cleanEmail);
    if (exists) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const newStudent = {
      id: 'stu-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'student',
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...students, newStudent]));

    const session = startSession(newStudent);
    return { ok: true, user: session };
  };

  // Checks email, password and the selected Student/Admin tab
  const login = ({ email, password, role }) => {
    const cleanEmail = email.trim().toLowerCase();
    const allUsers = [ADMIN, ...readStudents()];
    const found = allUsers.find(
      (u) => u.email === cleanEmail && u.password === password
    );

    if (!found) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    if (found.role !== role) {
      return {
        ok: false,
        error:
          found.role === 'admin'
            ? 'This is an admin account. Please use the Admin tab.'
            : 'This is not an admin account. Please use the Student tab.',
      };
    }

    const session = startSession(found);
    return { ok: true, user: session };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
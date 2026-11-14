import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

function friendlyError(error) {
  const code = error?.code || '';
  const msg = (error?.message || '').toLowerCase();

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }
  if (code === 'user_already_exists' || msg.includes('already registered')) {
    return 'An account with this email already exists.';
  }
  if (code === 'weak_password' || msg.includes('password should be')) {
    return 'Password is too weak. Please use at least 8 characters.';
  }
  if (code === 'email_address_invalid' || msg.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('rate_limit') || msg.includes('rate limit')) {
    return 'Too many attempts. Please wait a little and try again.';
  }
  return 'Something went wrong. Please try again.';
}

// Reads the user's profile (name, email, role) from the database
async function fetchProfile(uid) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role')
    .eq('id', uid)
    .single();

  if (error || !data) return null;
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const busy = useRef(false); // true while a login/signup is running

  // Keeps the user logged in after a page refresh
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (busy.current) return;

      // run outside the callback so Supabase calls inside it can't get stuck
      setTimeout(async () => {
        if (!session) {
          setUser(null);
          setLoading(false);
          return;
        }
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
        setLoading(false);
      }, 0);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // Creates a student account and logs them in
  const signup = async ({ name, email, password }) => {
    busy.current = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name: name.trim() } },
      });
      if (error) return { ok: false, error: friendlyError(error) };

      if (!data.session) {
        return {
          ok: false,
          error: 'Email confirmation is still turned on in Supabase. Turn it off and try again.',
        };
      }

      const profile = await fetchProfile(data.user.id);
      if (!profile) {
        return { ok: false, error: 'Account created, but the profile is missing. Please log in.' };
      }

      setUser(profile);
      return { ok: true, user: profile };
    } catch {
      return { ok: false, error: 'Something went wrong. Please try again.' };
    } finally {
      busy.current = false;
    }
  };

  // Checks email, password and the selected Student/Admin tab
  const login = async ({ email, password, role }) => {
    busy.current = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { ok: false, error: friendlyError(error) };

      const profile = await fetchProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        return { ok: false, error: 'This account has no profile. Please sign up again.' };
      }

      if (profile.role !== role) {
        await supabase.auth.signOut();
        return {
          ok: false,
          error:
            profile.role === 'admin'
              ? 'This is an admin account. Please use the Admin tab.'
              : 'This is not an admin account. Please use the Student tab.',
        };
      }

      setUser(profile);
      return { ok: true, user: profile };
    } catch {
      return { ok: false, error: 'Something went wrong. Please try again.' };
    } finally {
      busy.current = false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
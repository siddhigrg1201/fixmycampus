import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const ComplaintsContext = createContext(null);

// database row -> the shape your pages already use
const toComplaint = (row) => ({
  id: row.id,
  title: row.title,
  department: row.department,
  floor: row.floor,
  room: row.room || '',
  priority: row.priority,
  status: row.status,
  image: row.image_url,
  anonymous: row.anonymous,
  reportedBy: row.reported_by,
  reporterName: row.reporter_name,
  createdAt: row.created_at,
});

export function ComplaintsProvider({ children }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const uid = user?.id;

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Could not load complaints:', error);
      return;
    }
    setComplaints(data.map(toComplaint));
  }, []);

  // Load once, then reload whenever anyone changes a complaint
  useEffect(() => {
    if (!uid) return;

    load();

    const channel = supabase
      .channel('complaints-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => load())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [uid, load]);

  // New complaints start as "pending" with no priority (the admin sets it later)
  const addComplaint = async (data) => {
    try {
      let imageUrl = null;

      if (data.image) {
        const blob = await (await fetch(data.image)).blob();
        const path = `${data.reportedBy}/${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('complaint-images')
          .upload(path, blob, { contentType: 'image/jpeg' });
        if (uploadError) throw uploadError;

        imageUrl = supabase.storage.from('complaint-images').getPublicUrl(path).data.publicUrl;
      }

      const { error } = await supabase.from('complaints').insert({
        title: data.title,
        department: data.department,
        floor: data.floor,
        room: data.room || '',
        anonymous: data.anonymous,
        image_url: imageUrl,
        reported_by: data.reportedBy,
        // anonymous complaints never store the student's name
        reporter_name: data.anonymous ? 'Anonymous' : data.reporterName,
      });
      if (error) throw error;

      await load();
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false, error: 'Could not submit the complaint. Please try again.' };
    }
  };

  // Used by the admin to change priority / status
  const updateComplaint = async (id, changes) => {
    // show the change straight away, then save it
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, ...changes } : c)));

    const { error } = await supabase.from('complaints').update(changes).eq('id', id);
    if (error) {
      console.error(error);
      alert('Could not update the complaint. Please try again.');
      await load();
    }
  };

  return (
    <ComplaintsContext.Provider
      value={{ complaints: user ? complaints : [], addComplaint, updateComplaint }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComplaints() {
  return useContext(ComplaintsContext);
}
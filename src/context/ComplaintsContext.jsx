import { createContext, useContext, useState } from 'react';

const ComplaintsContext = createContext(null);
const KEY = 'fmc_complaints';

// Sample complaints so the page isn't empty. Remove when the backend is connected.
const SEED = [
  {
    id: 'seed-1', title: 'Water cooler leaking continuously',
    department: 'Applied Sciences', floor: '2nd floor', room: '',
    priority: 'high', status: 'in-progress', image: null, anonymous: false,
    reportedBy: 'seed-user', reporterName: 'Ananya', createdAt: '2026-10-30T09:00:00.000Z',
  },
  {
    id: 'seed-2', title: 'Exposed electrical wiring near the stairs',
    department: 'Computer Science & Engineering', floor: '1st floor', room: 'Room 112',
    priority: 'high', status: 'pending', image: null, anonymous: true,
    reportedBy: 'seed-user', reporterName: 'Riya', createdAt: '2026-11-01T11:30:00.000Z',
  },
  {
    id: 'seed-3', title: 'Ceiling fan not working',
    department: 'Information Technology', floor: '3rd floor', room: 'Room 304',
    priority: 'medium', status: 'pending', image: null, anonymous: false,
    reportedBy: 'seed-user', reporterName: 'Simran', createdAt: '2026-10-29T14:15:00.000Z',
  },
  {
    id: 'seed-4', title: 'Broken chairs in the reading room',
    department: 'Library', floor: 'Ground floor', room: '',
    priority: 'medium', status: 'resolved', image: null, anonymous: false,
    reportedBy: 'seed-user', reporterName: 'Kavya', createdAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'seed-5', title: 'Damaged notice board',
    department: 'Administrative Block', floor: '1st floor', room: '',
    priority: 'low', status: 'pending', image: null, anonymous: false,
    reportedBy: 'seed-user', reporterName: 'Meera', createdAt: '2026-10-25T16:45:00.000Z',
  },
];

function load() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore and fall back to sample data
  }
  return SEED;
}

export function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useState(load);

  // New complaints start as "pending" with no priority (the admin sets it later)
  const addComplaint = (data) => {
    const newComplaint = {
      id: 'c-' + Date.now(),
      ...data,
      priority: null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newComplaint, ...complaints];

    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {
      return { ok: false, error: 'Could not save the complaint. The image may be too large.' };
    }
    setComplaints(updated);
    return { ok: true };
  };

  // Used by the admin to change priority / status
  const updateComplaint = (id, changes) => {
    const updated = complaints.map((c) => (c.id === id ? { ...c, ...changes } : c));
    setComplaints(updated);
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {
      // storage full: the change still shows until the page is refreshed
    }
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, addComplaint, updateComplaint }}>
      {children}
    </ComplaintsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComplaints() {
  return useContext(ComplaintsContext);
}
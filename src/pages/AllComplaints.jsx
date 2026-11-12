import { useState } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintModal from '../components/ComplaintModal';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import { PRIORITY_ORDER } from '../constants';
import '../styles/complaints.css';

export default function AllComplaints() {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const [open, setOpen] = useState(false);

  const isAdmin = user.role === 'admin';

  // High -> Medium -> Low -> (priority not set yet). Newest first within each group.
  const sorted = [...complaints].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 3;
    const pb = PRIORITY_ORDER[b.priority] ?? 3;
    if (pa !== pb) return pa - pb;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h1>Campus Issues</h1>
          <p>All reported complaints, with the most urgent ones first.</p>
        </div>

        {sorted.length === 0 ? (
          <div className="empty">
            {isAdmin
              ? 'No complaints have been reported yet.'
              : 'No complaints yet. Tap the + button to report one.'}
          </div>
        ) : (
          <div className="cards-grid">
            {sorted.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
          </div>
        )}
      </main>

      {!isAdmin && (
        <button
          className="fab"
          onClick={() => setOpen(true)}
          aria-label="Report an issue"
          title="Report an issue"
        >
          <Plus size={28} />
        </button>
      )}

      {open && !isAdmin && <ComplaintModal onClose={() => setOpen(false)} />}
    </>
  );
}
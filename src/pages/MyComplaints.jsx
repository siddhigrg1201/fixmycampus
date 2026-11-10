import Navbar from '../components/Navbar';
import ComplaintCard from '../components/ComplaintCard';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import '../styles/complaints.css';

export default function MyComplaints() {
  const { user } = useAuth();
  const { complaints } = useComplaints();

  const mine = complaints
    .filter((c) => c.reportedBy === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h1>My Complaints</h1>
          <p>
            {mine.length === 0
              ? 'Complaints you file will show up here.'
              : `${mine.length} complaint${mine.length > 1 ? 's' : ''} filed by you, newest first.`}
          </p>
        </div>

        {mine.length === 0 ? (
          <div className="empty">
            You haven&apos;t reported anything yet. Go to <strong>All Complaints</strong> and tap
            the + button to file your first complaint.
          </div>
        ) : (
          <div className="cards-grid">
            {mine.map((c) => <ComplaintCard key={c.id} complaint={c} mine />)}
          </div>
        )}
      </main>
    </>
  );
}

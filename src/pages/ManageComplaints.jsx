import Navbar from '../components/Navbar';
import ComplaintCard from '../components/ComplaintCard';
import { useComplaints } from '../context/ComplaintsContext';
import '../styles/complaints.css';
import '../styles/manage.css';

const SECTIONS = [
  {
    key: 'none',
    title: 'Priority not set',
    hint: 'Choose a priority and the complaint moves to the matching section below.',
    match: (c) => !c.priority,
  },
  { key: 'high', title: 'High priority', hint: 'Solve these first.', match: (c) => c.priority === 'high' },
  { key: 'medium', title: 'Medium priority', hint: '', match: (c) => c.priority === 'medium' },
  { key: 'low', title: 'Low priority', hint: '', match: (c) => c.priority === 'low' },
];

const STATUS_RANK = { pending: 0, 'in-progress': 1, resolved: 2 };

export default function ManageComplaints() {
  const { complaints, updateComplaint } = useComplaints();
  const needsPriority = complaints.filter((c) => !c.priority).length;

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h1>Manage Complaints</h1>
          <p>
            Set a priority for each complaint and keep its status up to date.
            Students see these changes on their cards.
          </p>
        </div>

        {needsPriority > 0 && (
          <div className="mg-alert">
            {needsPriority} complaint{needsPriority > 1 ? 's' : ''} still need
            {needsPriority > 1 ? '' : 's'} a priority.
          </div>
        )}

        {SECTIONS.map((section) => {
          // unresolved first, oldest waiting first
          const items = complaints
            .filter(section.match)
            .sort(
              (a, b) =>
                STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
                new Date(a.createdAt) - new Date(b.createdAt)
            );

          return (
            <section key={section.key} className={`mg-section ${section.key}`}>
              <div className="mg-head">
                <span className="mg-dot" />
                <h2>{section.title}</h2>
                <span className="mg-count">{items.length}</span>
              </div>
              {section.hint && <p className="mg-hint">{section.hint}</p>}

              {items.length === 0 ? (
                <div className="mg-empty">No complaints here.</div>
              ) : (
                <div className="cards-grid">
                  {items.map((c) => (
                    <div key={c.id} className="mg-item">
                      <ComplaintCard complaint={c} admin />

                      <div className="mg-controls">
                        <label>
                          Priority
                          <select
                            value={c.priority || ''}
                            onChange={(e) =>
                              updateComplaint(c.id, { priority: e.target.value || null })
                            }
                          >
                            <option value="">Not set</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </label>

                        <label>
                          Status
                          <select
                            value={c.status}
                            onChange={(e) => updateComplaint(c.id, { status: e.target.value })}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>
    </>
  );
}
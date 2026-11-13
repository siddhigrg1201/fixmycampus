import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Layers, DoorOpen, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useComplaints } from '../context/ComplaintsContext';
import { PRIORITY_LABELS, PRIORITY_ORDER, STATUS_LABELS } from '../constants';
import '../styles/complaints.css';
import '../styles/analytics.css';

// An open complaint is "overdue" once it is older than this many days
const OVERDUE_DAYS = { high: 2, medium: 5, low: 10 };
const DAY = 24 * 60 * 60 * 1000;

const ago = (days) => (days <= 0 ? 'today' : days === 1 ? '1 day ago' : `${days} days ago`);

/* ---------- Horizontal bar chart ---------- */
function BarChart({ rows, color = '#1b6b3f' }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="bars">
      {rows.map((r) => (
        <div key={r.label} className="bar-row">
          <span className="bar-label" title={r.label}>{r.label}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(r.value / max) * 100}%`, background: r.color || color }}
            />
          </div>
          <span className="bar-value">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Donut chart ---------- */
function Donut({ data }) {
  const R = 70;
  const C = 2 * Math.PI * R;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const segments = data.map((d, i) => {
    const before = data.slice(0, i).reduce((sum, x) => sum + x.value, 0);
    return {
      ...d,
      len: total ? (d.value / total) * C : 0,
      offset: total ? (before / total) * C : 0,
    };
  });

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 180 180" className="donut">
        <circle cx="90" cy="90" r={R} fill="none" stroke="#eef2ef" strokeWidth="22" />
        {segments.map(
          (s) =>
            s.value > 0 && (
              <circle
                key={s.label}
                cx="90" cy="90" r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="22"
                strokeDasharray={`${s.len} ${C - s.len}`}
                strokeDashoffset={-s.offset}
                transform="rotate(-90 90 90)"
              />
            )
        )}
        <text x="90" y="92" textAnchor="middle" className="donut-total">{total}</text>
        <text x="90" y="112" textAnchor="middle" className="donut-caption">complaints</text>
      </svg>

      <ul className="legend">
        {data.map((d) => (
          <li key={d.label}>
            <span className="legend-dot" style={{ background: d.color }} />
            {d.label}
            <b>{d.value}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Analytics() {
  const { complaints } = useComplaints();
  const [now] = useState(() => Date.now());

  const count = (fn) => complaints.filter(fn).length;
  const total = complaints.length;
  const pending = count((c) => c.status === 'pending');
  const inProgress = count((c) => c.status === 'in-progress');
  const resolved = count((c) => c.status === 'resolved');
  const needsPriority = count((c) => !c.priority);
  const resolvedPct = total ? Math.round((resolved / total) * 100) : 0;

  const ageDays = (c) => Math.floor((now - new Date(c.createdAt).getTime()) / DAY);
  const isOverdue = (c) =>
    c.status !== 'resolved' && c.priority && ageDays(c) > OVERDUE_DAYS[c.priority];
  const overdue = count(isOverdue);

  // complaints per department, biggest first
  const deptCounts = complaints.reduce((acc, c) => {
    acc[c.department] = (acc[c.department] || 0) + 1;
    return acc;
  }, {});
  const deptRows = Object.entries(deptCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const statusData = [
    { label: STATUS_LABELS.pending, value: pending, color: '#94a3ab' },
    { label: STATUS_LABELS['in-progress'], value: inProgress, color: '#3b82f6' },
    { label: STATUS_LABELS.resolved, value: resolved, color: '#3aa76d' },
  ];

  const priorityRows = [
    { label: 'High', value: count((c) => c.priority === 'high'), color: '#e5484d' },
    { label: 'Medium', value: count((c) => c.priority === 'medium'), color: '#f5a524' },
    { label: 'Low', value: count((c) => c.priority === 'low'), color: '#3aa76d' },
    { label: 'Not set', value: needsPriority, color: '#94a3ab' },
  ];

  // open complaints that have a priority: highest priority first, longest waiting first
  const urgent = complaints
    .filter((c) => c.status !== 'resolved' && c.priority)
    .sort(
      (a, b) =>
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
        new Date(a.createdAt) - new Date(b.createdAt)
    );
  const top = urgent[0];
  const upNext = urgent.slice(1, 5);

  const stats = [
    { label: 'Total complaints', value: total },
    { label: 'Resolved', value: `${resolvedPct}%`, hint: `${resolved} of ${total}` },
    { label: 'Need a priority', value: needsPriority, warn: needsPriority > 0 },
    { label: 'Overdue', value: overdue, danger: overdue > 0 },
  ];

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h1>Analytics</h1>
          <p>A quick picture of what is happening across campus.</p>
        </div>

        {needsPriority > 0 && (
          <div className="an-note">
            {needsPriority} complaint{needsPriority > 1 ? 's have' : ' has'} no priority yet.{' '}
            <Link to="/admin/manage">Set priority</Link>
          </div>
        )}

        <div className="an-stats">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`an-stat ${s.warn ? 'warn' : ''} ${s.danger ? 'danger' : ''}`}
            >
              <b>{s.value}</b>
              <span>{s.label}</span>
              {s.hint && <small>{s.hint}</small>}
            </div>
          ))}
        </div>

        {/* Highest priority complaint */}
        {top ? (
          <section className="an-spot">
            <div className="an-spot-tag">Solve this first</div>
            <div className="an-spot-body">
              <div>
                <div className="an-badges">
                  <span className={`badge priority-${top.priority}`}>
                    {PRIORITY_LABELS[top.priority]}
                  </span>
                  <span className={`badge status-${top.status}`}>{STATUS_LABELS[top.status]}</span>
                  {isOverdue(top) && <span className="badge an-overdue">Overdue</span>}
                </div>
                <h2>{top.title}</h2>
                <ul className="c-meta">
                  <li><Building2 size={15} /> {top.department}</li>
                  <li><Layers size={15} /> {top.floor}</li>
                  {top.room && <li><DoorOpen size={15} /> {top.room}</li>}
                  <li><Clock size={15} /> Reported {ago(ageDays(top))}</li>
                </ul>
              </div>
              <Link to="/admin/manage" className="btn btn-solid">Update status</Link>
            </div>
          </section>
        ) : (
          <section className="an-spot clear">
            <div className="an-spot-tag">All clear</div>
            <h2>No open complaints with a priority right now.</h2>
          </section>
        )}

        <div className="an-grid">
          <section className="an-card">
            <h3>Complaints by department</h3>
            <p className="an-sub">Which places need the most attention.</p>
            {deptRows.length === 0 ? (
              <p className="an-sub">No data yet.</p>
            ) : (
              <BarChart rows={deptRows} />
            )}
          </section>

          <section className="an-card">
            <h3>Complaint status</h3>
            <p className="an-sub">How many are resolved, in progress or pending.</p>
            <Donut data={statusData} />
          </section>

          <section className="an-card">
            <h3>Complaints by priority</h3>
            <p className="an-sub">How urgent the current workload is.</p>
            <BarChart rows={priorityRows} />
          </section>

          <section className="an-card">
            <h3>Up next</h3>
            <p className="an-sub">The next most urgent open complaints.</p>
            {upNext.length === 0 ? (
              <p className="an-sub">Nothing else waiting.</p>
            ) : (
              <ul className="next-list">
                {upNext.map((c) => (
                  <li key={c.id}>
                    <span className={`next-dot ${c.priority}`} />
                    <div>
                      <div className="next-title">{c.title}</div>
                      <div className="next-meta">
                        {c.department} · {ago(ageDays(c))}
                        {isOverdue(c) && <b className="next-overdue"> · Overdue</b>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
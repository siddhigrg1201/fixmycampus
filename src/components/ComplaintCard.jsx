import { Building2, Layers, DoorOpen, User } from 'lucide-react';
import { PRIORITY_LABELS, STATUS_LABELS } from '../constants.js';

export default function ComplaintCard({ complaint, mine = false, admin = false }) {
  const {
    title, department, floor, room, priority,
    status, image, anonymous, reporterName, createdAt,
  } = complaint;

  const date = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

    let reporter;
  if (admin) {
    reporter = anonymous ? `${reporterName} (hidden from students)` : reporterName;
  } else if (mine) {
    reporter = anonymous ? 'Posted anonymously' : 'Posted by you';
  } else {
    reporter = anonymous ? 'Anonymous' : reporterName;
  }

  return (
    <article className={`c-card ${priority || 'none'}`}>
      {image && <img src={image} alt={title} className="c-img" />}

      <div className="c-body">
        <div className="c-badges">
          <span className={`badge priority-${priority || 'none'}`}>
            {priority ? PRIORITY_LABELS[priority] : 'Priority not set'}
          </span>
          <span className={`badge status-${status}`}>{STATUS_LABELS[status]}</span>
        </div>

        <h3 className="c-title">{title}</h3>

        <ul className="c-meta">
          <li><Building2 size={15} /> {department}</li>
          <li><Layers size={15} /> {floor}</li>
          {room && <li><DoorOpen size={15} /> {room}</li>}
        </ul>
      </div>

      <div className="c-foot">
        <span className="c-reporter"><User size={13} /> {reporter}</span>
        <span>{date}</span>
      </div>
    </article>
  );
}

import { Camera, MapPin, Wrench, ThumbsUp } from 'lucide-react';
import campus from '../assets/campus-bg.jpg';

export default function StatusCard() {
  return (
    <div className="status-card">
      <div className="card-img">
        <img src={campus} alt="" />
        <Camera size={16} className="cam-icon" />
      </div>
      <h4>Water leakage in Block A</h4>
      <p><MapPin size={13} /> Block A, 2nd Floor</p>
      <p><Wrench size={13} /> Plumbing</p>
      <span className="priority">High Priority</span>

      <ul className="timeline">
        <li className="done">Reported <small>12 Oct 2026</small></li>
        <li className="active">In Progress <small>13 Oct 2026</small></li>
        <li>Resolved <small>—</small></li>
      </ul>

      <span className="upvote"><ThumbsUp size={13} /> 12</span>
    </div>
  );
}
import { Megaphone, ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import student from '../assets/student.png';
import FeatureStrip from './FeatureStrip';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="pill"><Leaf size={14} /> A Cleaner • Safer • Better Campus</span>
        <h1>FixMyCampus</h1>
        <h2>Report. Track. Make a Difference.</h2>
        <p>
          A platform for IGDTUW students to report campus issues, track their
          status and help build a better campus together.
        </p>
        <div className="hero-buttons">
          <Link to="/report" className="btn btn-solid">
            <Megaphone size={16} /> Report an Issue <ArrowRight size={16} />
          </Link>
          <Link to="/track" className="btn btn-outline">Track Your Complaints</Link>
        </div>
      </div>

      <div className="hero-visual">
        <img src={student} alt="Student reporting an issue" className="student" />
      </div>

      <FeatureStrip />
    </section>
  );
}
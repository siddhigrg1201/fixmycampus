import { Leaf, Droplets, Zap, Wrench, Lightbulb, Trash2, Wifi } from 'lucide-react';
import Navbar from './Navbar';
import '../styles/auth.css';

const chips = [
  { icon: Droplets, label: 'Plumbing', cls: 'chip-1' },
  { icon: Zap, label: 'Electrical', cls: 'chip-2' },
  { icon: Wrench, label: 'Maintenance', cls: 'chip-3' },
  { icon: Lightbulb, label: 'Lighting', cls: 'chip-4' },
  { icon: Trash2, label: 'Cleanliness', cls: 'chip-5' },
  { icon: Wifi, label: 'Network', cls: 'chip-6' },
];

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-watermark">IGDTUW</div>

      {chips.map(({ icon: Icon, label, cls }) => (
        <div key={label} className={`chip ${cls}`}>
          <span className="chip-icon"><Icon size={16} /></span>
          {label}
        </div>
      ))}

      <main className="auth-main">
        <div className="auth-box">{children}</div>
        <span className="pill">
          <Leaf size={14} /> A Cleaner • Safer • Better Campus
        </span>
      </main>

      <svg className="auth-wave" viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path
          d="M0,96 C240,160 480,32 720,80 C960,128 1200,40 1440,96 L1440,160 L0,160 Z"
          fill="#1b6b3f" opacity="0.14"
        />
        <path
          d="M0,120 C300,60 560,150 820,110 C1080,70 1260,130 1440,100 L1440,160 L0,160 Z"
          fill="#0f4a2c" opacity="0.18"
        />
      </svg>
    </div>
  );
}
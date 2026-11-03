import { ShieldCheck, Search, Users, BarChart3 } from 'lucide-react';

const items = [
  { icon: ShieldCheck, label: 'Report Campus Issues' },
  { icon: Search, label: 'Track Real-Time Status' },
  { icon: Users, label: 'Get Support from Others' },
  { icon: BarChart3, label: 'Build a Better Campus Together' },
];

export default function FeatureStrip() {
  return (
    <div className="features">
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="feature">
          <span className="icon-circle"><Icon size={20} /></span>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}
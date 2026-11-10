import { useState } from 'react';
import { X, ImagePlus, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import { DEPARTMENTS, FLOORS } from '../constants';

// Shrinks the photo so it fits in browser storage
function resizeImage(file, maxSize = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ComplaintModal({ onClose }) {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();

  const [form, setForm] = useState({ title: '', department: '', floor: '', room: '' });
  const [anonymous, setAnonymous] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    try {
      setImage(await resizeImage(file));
      setError('');
    } catch {
      setError('Could not read that image. Please try another one.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Please enter a title for the problem.');
      return;
    }
    if (!form.department) {
      setError('Please select the department.');
      return;
    }
    if (!form.floor) {
      setError('Please select the floor.');
      return;
    }

    const result = addComplaint({
      title: form.title.trim(),
      department: form.department,
      floor: form.floor,
      room: form.room.trim(),
      anonymous,
      image,
      reportedBy: user.id,
      reporterName: user.name,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Report an issue</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {error && <div className="m-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="m-field">
            <label htmlFor="title">Title of the problem *</label>
            <input
              id="title" name="title" type="text"
              placeholder="e.g. Water cooler leaking"
              value={form.title} onChange={handleChange}
            />
          </div>

          <div className="m-field">
            <label htmlFor="department">Department *</label>
            <select id="department" name="department" value={form.department} onChange={handleChange}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="m-row">
            <div className="m-field">
              <label htmlFor="floor">Floor *</label>
              <select id="floor" name="floor" value={form.floor} onChange={handleChange}>
                <option value="">Select floor</option>
                {FLOORS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="m-field">
              <label htmlFor="room">Room number (optional)</label>
              <input
                id="room" name="room" type="text" placeholder="e.g. 204"
                value={form.room} onChange={handleChange}
              />
            </div>
          </div>

          <div className="m-field">
            <label>Photo (optional)</label>
            {image ? (
              <div className="m-preview">
                <img src={image} alt="Preview" />
                <button type="button" onClick={() => setImage(null)}>Remove photo</button>
              </div>
            ) : (
              <label className="m-upload">
                <ImagePlus size={22} />
                <span>Click to add a photo</span>
                <input type="file" accept="image/*" onChange={handleImage} hidden />
              </label>
            )}
          </div>

          <label className="m-anon">
            <input
              type="checkbox" checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <EyeOff size={16} />
            <span>Post anonymously. Other students won&apos;t see my name.</span>
          </label>

          <button type="submit" className="btn btn-solid m-submit">Submit complaint</button>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PunchType } from '../types';
import { X, Clock, Calendar, Tag, MapPin, FileText, Check } from 'lucide-react';

interface ManualPunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualPunchModal: React.FC<ManualPunchModalProps> = ({ isOpen, onClose }) => {
  const { addManualPunch, jobCodes, selectedJobCode, punchLocation } = useApp();

  const [type, setType] = useState<PunchType>('IN');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [jobCode, setJobCode] = useState(selectedJobCode.code);
  const [location, setLocation] = useState(punchLocation);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date(`${date}T${time}:00`).toISOString();
    const selectedJob = jobCodes.find(j => j.code === jobCode) || jobCodes[0];

    addManualPunch({
      timestamp,
      type,
      jobCode: selectedJob.code,
      jobName: selectedJob.name,
      location,
      note: note || 'Manual punch correction'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)' }}>
              <Clock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Manual Time Punch</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Log a missed punch or correct your work hours</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
              Punch Event Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {(['IN', 'BREAK_START', 'BREAK_END', 'OUT'] as PunchType[]).map((pType) => (
                <button
                  key={pType}
                  type="button"
                  onClick={() => setType(pType)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    border: type === pType ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                    background: type === pType ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-card-solid)',
                    color: type === pType ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {pType === 'IN' && 'Clock In'}
                  {pType === 'BREAK_START' && 'Break Start'}
                  {pType === 'BREAK_END' && 'Break End'}
                  {pType === 'OUT' && 'Clock Out'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={13} />
                <span>Date</span>
              </label>
              <input
                type="date"
                className="input-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} />
                <span>Punch Time</span>
              </label>
              <input
                type="time"
                className="input-control font-mono"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Tag size={13} />
                <span>Job Code</span>
              </label>
              <select className="input-control" value={jobCode} onChange={(e) => setJobCode(e.target.value)}>
                {jobCodes.map((j) => (
                  <option key={j.code} value={j.code}>
                    [{j.code}] {j.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} />
                <span>Location</span>
              </label>
              <select className="input-control" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="San Francisco HQ - Tech Wing">San Francisco HQ - Tech Wing</option>
                <option value="Austin Fulfillment Center B">Austin Fulfillment Center B</option>
                <option value="Remote / Home Office">Remote / Home Office</option>
                <option value="Client Site / Field Service">Client Site / Field Service</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FileText size={13} />
              <span>Reason / Explanation for Adjustment</span>
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Forgot to clock in after morning team meeting"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <Check size={16} />
              <span>Save Manual Punch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

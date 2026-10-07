import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PTORequest } from '../types';
import { X, Calendar, Clock, HeartHandshake, Info, Send } from 'lucide-react';

interface TimeOffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimeOffModal: React.FC<TimeOffModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, submitPTORequest } = useApp();

  const [type, setType] = useState<PTORequest['type']>('Vacation');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [totalHours, setTotalHours] = useState<number>(8);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPTORequest({
      type,
      startDate,
      endDate,
      totalHours: Number(totalHours),
      reason: reason || 'Scheduled time off request'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Request Time Off / PTO</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submit time off for manager approval</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Balance info card */}
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Available PTO Balance
              </div>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                {currentUser.ptoHoursRemaining.toFixed(1)} hrs
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Sick Leave
              </div>
              <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>
                {currentUser.sickHoursRemaining.toFixed(1)} hrs
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
              Leave Category
            </label>
            <select
              className="input-control"
              value={type}
              onChange={(e) => setType(e.target.value as PTORequest['type'])}
            >
              <option value="Vacation">Vacation / Paid Time Off (PTO)</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal">Personal Leave</option>
              <option value="Floating Holiday">Floating Holiday</option>
              <option value="Bereavement">Bereavement</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                Start Date
              </label>
              <input
                type="date"
                className="input-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                End Date
              </label>
              <input
                type="date"
                className="input-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} />
              <span>Total Requested Hours</span>
            </label>
            <input
              type="number"
              min="1"
              max={currentUser.ptoHoursRemaining + 40}
              step="0.5"
              className="input-control font-mono"
              value={totalHours}
              onChange={(e) => setTotalHours(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
              Reason / Notes for Approving Manager
            </label>
            <textarea
              className="input-control"
              rows={3}
              placeholder="e.g. Scheduled annual holiday trip or medical appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-success" style={{ gap: '0.4rem' }}>
              <Send size={15} />
              <span>Submit PTO Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

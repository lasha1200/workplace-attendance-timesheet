import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Plus,
  RefreshCw,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ChevronRight,
  Filter
} from 'lucide-react';

interface SchedulePageProps {
  onOpenTimeOff: () => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ onOpenTimeOff }) => {
  const { schedules, currentUser, requestShiftSwap, ptoRequests } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [swapModalShiftId, setSwapModalShiftId] = useState<string | null>(null);
  const [swapColleague, setSwapColleague] = useState('');

  const filteredSchedules = schedules.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  const nextUpcomingShift = schedules.find(s => s.status === 'scheduled');

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (swapModalShiftId && swapColleague) {
      requestShiftSwap(swapModalShiftId, swapColleague);
      setSwapModalShiftId(null);
      setSwapColleague('');
    }
  };

  return (
    <div>
      {/* Top Banner: Next Shift & PTO Balances */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.4fr) 1fr',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}
        className="schedule-top-grid"
      >
        {/* Next Shift Countdown Card */}
        {nextUpcomingShift ? (
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
              border: '1px solid var(--border-highlight)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-gradient)', color: '#ffffff' }}>
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-light)', letterSpacing: '0.05em' }}>
                      Next Upcoming Shift
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      {nextUpcomingShift.title}
                    </h3>
                  </div>
                </div>
                <span className="badge badge-purple">
                  {nextUpcomingShift.type.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Date</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{nextUpcomingShift.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Scheduled Time</div>
                  <div className="font-mono" style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-light)' }}>
                    {nextUpcomingShift.startTime} – {nextUpcomingShift.endTime}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Location</div>
                  <div style={{ fontWeight: 500, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {nextUpcomingShift.location}
                  </div>
                </div>
              </div>

              {nextUpcomingShift.notes && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem', fontStyle: 'italic' }}>
                  "{nextUpcomingShift.notes}"
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => setSwapModalShiftId(nextUpcomingShift.id)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', gap: '0.35rem' }}
              >
                <RefreshCw size={14} />
                <span>Request Shift Swap</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>No upcoming shifts scheduled.</span>
          </div>
        )}

        {/* PTO & Leave Balances Widget */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            background: 'var(--bg-card-solid)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                Paid Time Off & Accruals
              </div>
              <button
                onClick={onOpenTimeOff}
                className="btn btn-primary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.35rem' }}
              >
                <Plus size={14} />
                <span>Request PTO</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vacation Hours</div>
                <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                  {currentUser.ptoHoursRemaining.toFixed(1)} <span style={{ fontSize: '0.8rem' }}>hrs</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  ≈ {(currentUser.ptoHoursRemaining / 8).toFixed(1)} work days
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sick Leave</div>
                <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                  {currentUser.sickHoursRemaining.toFixed(1)} <span style={{ fontSize: '0.8rem' }}>hrs</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Protected leave balance
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Floating Holidays: <strong>{currentUser.floatingHolidays} Days</strong></span>
              <span>Accrual Rate: <strong>6.67 hrs / month</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Filters & Shift Grid */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Published Work Shifts</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Assigned shifts for the current schedule rotation
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)', marginRight: '4px' }} />
            {['all', 'regular', 'remote', 'overtime', 'on-call'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: filterType === f ? '1px solid var(--primary-light)' : '1px solid var(--border-subtle)',
                  background: filterType === f ? 'var(--primary-gradient)' : 'transparent',
                  color: filterType === f ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Shifts List Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredSchedules.map((shift) => {
            const shiftTypeColor =
              shift.type === 'overtime'
                ? '#f59e0b'
                : shift.type === 'remote'
                ? '#06b6d4'
                : shift.type === 'on-call'
                ? '#8b5cf6'
                : '#3b82f6';

            return (
              <div
                key={shift.id}
                style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: `4px solid ${shiftTypeColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  transition: 'transform 0.15s ease, border-color 0.15s ease'
                }}
                className="glass-panel-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '240px' }}>
                  <div style={{ textAlign: 'center', minWidth: '60px', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {new Date(shift.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' })}
                    </div>
                    <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {shift.date.split('-')[2]}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {shift.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} />
                        <strong className="font-mono">{shift.startTime} – {shift.endTime}</strong>
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={12} />
                        {shift.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    className="badge"
                    style={{
                      background: `rgba(99, 102, 241, 0.1)`,
                      color: shiftTypeColor,
                      border: `1px solid ${shiftTypeColor}33`
                    }}
                  >
                    {shift.type.toUpperCase()}
                  </span>

                  {shift.status === 'swapped' ? (
                    <span className="badge badge-warning">Swap Pending</span>
                  ) : (
                    <button
                      onClick={() => setSwapModalShiftId(shift.id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
                    >
                      <RefreshCw size={13} />
                      <span>Swap</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PTO & Time Off Requests History */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem' }}>
          Recent Time Off / PTO Requests
        </h3>
        {ptoRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {ptoRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'rgba(0,0,0,0.15)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {req.type} ({req.totalHours} hours)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {req.startDate} to {req.endDate} • Submitted {req.submittedDate} • Reason: {req.reason}
                  </div>
                </div>
                <div>
                  {req.status === 'Approved' && (
                    <span className="badge badge-success">Approved</span>
                  )}
                  {req.status === 'Pending' && (
                    <span className="badge badge-warning">Manager Pending</span>
                  )}
                  {req.status === 'Denied' && (
                    <span className="badge badge-danger">Denied</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pending time off requests.</div>
        )}
      </div>

      {/* Shift Swap Modal */}
      {swapModalShiftId && (
        <div className="modal-overlay" onClick={() => setSwapModalShiftId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Request Shift Swap</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Offer your assigned shift to a qualified team member</div>
            </div>
            <form onSubmit={handleSwapSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                  Select Colleague to Swap With
                </label>
                <select
                  className="input-control"
                  value={swapColleague}
                  onChange={(e) => setSwapColleague(e.target.value)}
                  required
                >
                  <option value="">-- Choose coworker --</option>
                  <option value="Marcus Vance (Logistics Lead)">Marcus Vance (Logistics Lead)</option>
                  <option value="Maya Lin (Product Designer)">Maya Lin (Product Designer)</option>
                  <option value="Devon Clark (Full-Stack Eng)">Devon Clark (Full-Stack Eng)</option>
                  <option value="Rachel Wei (Platform Eng)">Rachel Wei (Platform Eng)</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setSwapModalShiftId(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Swap Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

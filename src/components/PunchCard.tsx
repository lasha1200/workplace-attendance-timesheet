import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RealTimeClock } from './RealTimeClock';
import {
  Play,
  Square,
  Coffee,
  RotateCcw,
  Tag,
  MapPin,
  FileText,
  PlusCircle,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PunchCardProps {
  onOpenManualPunch: () => void;
}

export const PunchCard: React.FC<PunchCardProps> = ({ onOpenManualPunch }) => {
  const {
    punchStatus,
    selectedJobCode,
    setSelectedJobCode,
    punchLocation,
    setPunchLocation,
    punchNote,
    setPunchNote,
    jobCodes,
    clockIn,
    takeBreak,
    resumeWork,
    clockOut,
    recentPunches,
    currentUser
  } = useApp();

  const [customNoteInput, setCustomNoteInput] = useState('');

  const handleClockIn = () => {
    clockIn(customNoteInput);
    setCustomNoteInput('');
  };

  const handleClockOut = () => {
    clockOut(customNoteInput);
    setCustomNoteInput('');
  };

  const formatPunchTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}
      className="punch-grid-layout"
    >
      {/* 1. Real-time active clock widget (Left Side) */}
      <RealTimeClock />

      {/* 2. Punch Action Station & Job Controls (Right Side) */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)'
                }}
              />
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                Time Punch Station
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ({currentUser.name} • {currentUser.employeeId})
              </span>
            </div>

            <button
              onClick={onOpenManualPunch}
              className="btn btn-ghost"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', gap: '0.35rem' }}
              title="Add a punch you may have forgotten"
            >
              <PlusCircle size={15} style={{ color: 'var(--primary-light)' }} />
              <span>Manual Time Punch</span>
            </button>
          </div>

          {/* Job Code & Location Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <Tag size={13} style={{ color: 'var(--primary-light)' }} />
                <span>Job / Activity Code</span>
              </label>
              <select
                className="input-control"
                value={selectedJobCode.code}
                onChange={(e) => {
                  const found = jobCodes.find(j => j.code === e.target.value);
                  if (found) setSelectedJobCode(found);
                }}
                disabled={punchStatus !== 'CLOCKED_OUT'}
                style={{
                  opacity: punchStatus !== 'CLOCKED_OUT' ? 0.8 : 1,
                  fontWeight: 500,
                  fontSize: '0.85rem'
                }}
              >
                {jobCodes.map((job) => (
                  <option key={job.code} value={job.code}>
                    [{job.code}] {job.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <MapPin size={13} style={{ color: '#10b981' }} />
                <span>Work Location</span>
              </label>
              <select
                className="input-control"
                value={punchLocation}
                onChange={(e) => setPunchLocation(e.target.value)}
                disabled={punchStatus !== 'CLOCKED_OUT'}
                style={{ opacity: punchStatus !== 'CLOCKED_OUT' ? 0.8 : 1, fontSize: '0.85rem' }}
              >
                <option value="San Francisco HQ - Tech Wing">San Francisco HQ - Tech Wing</option>
                <option value="Austin Fulfillment Center B">Austin Fulfillment Center B</option>
                <option value="Remote / Home Office">Remote / Home Office</option>
                <option value="Client Site / Field Service">Client Site / Field Service</option>
              </select>
            </div>
          </div>

          {/* Optional Note / Shift Memo */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
              <FileText size={13} style={{ color: 'var(--text-muted)' }} />
              <span>Shift Memo / Punch Note (Optional)</span>
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Completed morning standup & reviewed PR #412"
              value={customNoteInput || punchNote}
              onChange={(e) => {
                setCustomNoteInput(e.target.value);
                setPunchNote(e.target.value);
              }}
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Primary Interactive Punch Buttons */}
        <div>
          {punchStatus === 'CLOCKED_OUT' && (
            <button
              id="btn-clock-in"
              onClick={handleClockIn}
              className="btn btn-success"
              style={{
                width: '100%',
                padding: '0.9rem 1.5rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <Play size={20} fill="#ffffff" />
              <span>CLOCK IN NOW</span>
            </button>
          )}

          {punchStatus === 'CLOCKED_IN' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.85rem' }}>
              <button
                id="btn-take-break"
                onClick={takeBreak}
                className="btn btn-warning"
                style={{
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Coffee size={18} />
                <span>START BREAK</span>
              </button>

              <button
                id="btn-clock-out"
                onClick={handleClockOut}
                className="btn btn-danger"
                style={{
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Square size={18} fill="#ffffff" />
                <span>CLOCK OUT</span>
              </button>
            </div>
          )}

          {punchStatus === 'ON_BREAK' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.85rem' }}>
              <button
                id="btn-resume-work"
                onClick={resumeWork}
                className="btn btn-success"
                style={{
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <RotateCcw size={18} />
                <span>RESUME WORK</span>
              </button>

              <button
                id="btn-clock-out-break"
                onClick={handleClockOut}
                className="btn btn-danger"
                style={{
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Square size={18} fill="#ffffff" />
                <span>END SHIFT</span>
              </button>
            </div>
          )}

          {/* Quick activity ticker */}
          {recentPunches.length > 0 && (
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <History size={13} style={{ color: 'var(--primary-light)' }} />
                <span>Last punch:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {recentPunches[0].type} at {formatPunchTime(recentPunches[0].timestamp)}
                </span>
                {recentPunches[0].isManual && (
                  <span className="badge badge-purple" style={{ padding: '1px 5px', fontSize: '0.65rem' }}>Manual</span>
                )}
              </div>
              <span style={{ color: 'var(--text-muted)' }}>
                {recentPunches[0].jobCode}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

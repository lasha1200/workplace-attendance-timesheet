import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Globe, Calendar, Zap } from 'lucide-react';

export const RealTimeClock: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { timeFormat, punchStatus, elapsedShiftSeconds, currentUser } = useApp();
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    // Tick every 500ms to ensure second transitions are snappy
    const timer = setInterval(() => {
      setTime(new Date());
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Format hours, minutes, seconds
  const hoursRaw = time.getHours();
  const is24h = timeFormat === '24h';
  const hours = is24h
    ? String(hoursRaw).padStart(2, '0')
    : String(hoursRaw % 12 || 12).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const ampm = is24h ? '' : hoursRaw >= 12 ? 'PM' : 'AM';

  // Format date and timezone
  const dateFormatted = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZoneShort = time.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2] || 'LOCAL';

  // Format shift elapsed time
  const shiftHours = Math.floor(elapsedShiftSeconds / 3600);
  const shiftMins = Math.floor((elapsedShiftSeconds % 3600) / 60);
  const shiftSecs = elapsedShiftSeconds % 60;
  const formattedShiftElapsed = `${String(shiftHours).padStart(2, '0')}:${String(shiftMins).padStart(2, '0')}:${String(shiftSecs).padStart(2, '0')}`;
  
  // Calculate live shift earnings
  const liveEarned = ((elapsedShiftSeconds / 3600) * currentUser.hourlyRate).toFixed(2);

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={16} style={{ color: 'var(--primary-light)' }} />
        <span className="font-mono" style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.05em' }}>
          {hours}:{minutes}:{seconds} {ampm}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({timeZoneShort})</span>
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(22, 31, 48, 0.9) 0%, rgba(13, 19, 33, 0.95) 100%)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Background ambient accent */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: punchStatus === 'CLOCKED_IN' ? 'rgba(16, 185, 129, 0.15)' : punchStatus === 'ON_BREAK' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.12)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Workplace Time Clock
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Globe size={12} />
              <span>{timeZoneName} ({timeZoneShort})</span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div
          className={`badge ${
            punchStatus === 'CLOCKED_IN'
              ? 'badge-success'
              : punchStatus === 'ON_BREAK'
              ? 'badge-warning'
              : 'badge-neutral'
          }`}
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
        >
          <span
            className={`pulse-dot ${
              punchStatus === 'CLOCKED_IN'
                ? 'pulse-green'
                : punchStatus === 'ON_BREAK'
                ? 'pulse-yellow'
                : 'pulse-slate'
            }`}
          />
          {punchStatus === 'CLOCKED_IN' && 'CLOCKED IN'}
          {punchStatus === 'ON_BREAK' && 'ON BREAK'}
          {punchStatus === 'CLOCKED_OUT' && 'CLOCKED OUT'}
        </div>
      </div>

      {/* Main Digital Clock Display with Seconds Increment */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'flex-start',
          gap: '0.35rem',
          margin: '0.75rem 0 0.5rem 0'
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
            color: 'var(--text-main)',
            lineHeight: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
        >
          <span>{hours}</span>
          <span style={{ color: 'var(--primary-light)', opacity: time.getSeconds() % 2 === 0 ? 1 : 0.4 }}>:</span>
          <span>{minutes}</span>
        </div>

        {/* Seconds Increment Block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '4px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--primary-light)',
              lineHeight: 1,
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '2px 6px',
              borderRadius: '6px',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
          >
            {seconds}
          </div>
          {!is24h && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
                marginTop: '2px'
              }}
            >
              {ampm}
            </span>
          )}
        </div>
      </div>

      {/* Date and Work Week Details */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.85rem'
        }}
      >
        <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
        <span>{dateFormatted}</span>
        <span style={{ color: 'var(--border-medium)' }}>•</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Week 41 / Q4</span>
      </div>

      {/* Live Shift Counter Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: punchStatus !== 'CLOCKED_OUT' ? '1fr 1fr' : '1fr',
          gap: '0.75rem',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
            Active Shift Duration
          </div>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: punchStatus === 'CLOCKED_IN' ? '#34d399' : 'var(--text-main)', marginTop: '2px' }}>
            {punchStatus === 'CLOCKED_OUT' ? '00:00:00' : formattedShiftElapsed}
          </div>
        </div>

        {punchStatus !== 'CLOCKED_OUT' && (
          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Zap size={11} style={{ color: '#fbbf24' }} />
              <span>Shift Est. Earnings</span>
            </div>
            <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>
              ${liveEarned}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  UserCheck,
  ChevronDown,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  LogOut,
  Building2,
  Layers,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    users,
    setCurrentUser,
    punchStatus,
    theme,
    toggleTheme,
    timeFormat,
    toggleTimeFormat,
    soundEnabled,
    toggleSound,
    logout,
    elapsedShiftSeconds
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format active elapsed time
  const shiftHours = Math.floor(elapsedShiftSeconds / 3600);
  const shiftMins = Math.floor((elapsedShiftSeconds % 3600) / 60);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: 'var(--bg-glass)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Brand & Workspace Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-primary)'
            }}
          >
            <Clock size={22} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                WorkPulse
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  color: 'var(--primary-light)',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}
              >
                ENTERPRISE
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Building2 size={11} />
              <span>Acme Global Technologies Inc.</span>
            </div>
          </div>
        </div>

        {/* Live Punch Status Indicator Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-card-solid)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginLeft: '0.5rem'
          }}
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
          <span style={{ color: punchStatus === 'CLOCKED_IN' ? '#34d399' : punchStatus === 'ON_BREAK' ? '#fbbf24' : 'var(--text-muted)' }}>
            {punchStatus === 'CLOCKED_IN' && `Clocked In (${shiftHours}h ${shiftMins}m)`}
            {punchStatus === 'ON_BREAK' && 'On Break'}
            {punchStatus === 'CLOCKED_OUT' && 'Off the Clock'}
          </span>
        </div>
      </div>

      {/* Quick Controls & User Profile Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* 12h / 24h Toggle */}
        <button
          onClick={toggleTimeFormat}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}
          title={`Switch to ${timeFormat === '12h' ? '24-hour' : '12-hour'} format`}
        >
          <span className="font-mono">{timeFormat.toUpperCase()}</span>
        </button>

        {/* Audio Effects Toggle */}
        <button
          onClick={toggleSound}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.65rem' }}
          title={soundEnabled ? 'Mute punch sounds' : 'Enable punch audio feedback'}
        >
          {soundEnabled ? (
            <Volume2 size={16} style={{ color: 'var(--primary-light)' }} />
          ) : (
            <VolumeX size={16} style={{ color: 'var(--text-muted)' }} />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.65rem' }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun size={16} style={{ color: '#fbbf24' }} />
          ) : (
            <Moon size={16} style={{ color: 'var(--primary)' }} />
          )}
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 0.25rem' }} />

        {/* Employee Profile Dropdown Switcher */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="btn btn-secondary"
            style={{
              padding: '0.35rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              borderRadius: 'var(--radius-md)',
              border: userMenuOpen ? '1px solid var(--primary-light)' : '1px solid var(--border-medium)'
            }}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--primary-light)'
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {currentUser.title.split(' ')[0]} • ${currentUser.hourlyRate.toFixed(2)}/hr
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Switch User / Account Menu */}
          {userMenuOpen && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '280px',
                padding: '0.5rem',
                zIndex: 100,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Switch Employee Profile
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Select an account to view their timesheet & payroll:
                </div>
              </div>

              {users.map((user) => {
                const isSelected = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setUserMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--text-main)',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.title} (${user.hourlyRate.toFixed(2)}/hr)
                      </div>
                    </div>
                    {isSelected && (
                      <UserCheck size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                    )}
                  </button>
                );
              })}

              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.5rem 0' }} />

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                }}
                className="btn btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8rem',
                  color: '#f87171'
                }}
              >
                <LogOut size={15} />
                <span>Sign Out of Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

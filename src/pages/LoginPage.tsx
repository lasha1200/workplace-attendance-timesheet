import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { User } from '../types';
import { Clock, ShieldCheck, Lock, UserCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { users, login } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<User>(users[0]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput) return;
    const ok = login(pinInput);
    if (!ok) {
      setPinInput('');
    }
  };

  const handleQuickLogin = (user: User) => {
    login(user);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.15), transparent 60%), #0b0f19'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '2.5rem',
          background: 'rgba(17, 24, 39, 0.85)',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: 'var(--shadow-glow-primary)'
            }}
          >
            <Clock size={30} color="#ffffff" strokeWidth={2.5} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
            WorkPulse OS
          </h1>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Workforce Time Card, Payroll & Schedule Portal
          </div>
        </div>

        {/* 1-Click Fast Demo Login Switcher */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} style={{ color: 'var(--primary-light)' }} />
            <span>Select Demo Employee to Log In:</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--text-main)',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                  e.currentTarget.style.borderColor = 'var(--primary-light)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img
                    src={u.avatar}
                    alt={u.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {u.title} • <strong className="font-mono">${u.hourlyRate.toFixed(2)}/hr</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Log In</span>
                  <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Or PIN login */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '1.5rem 0' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ position: 'relative', background: '#111827', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            OR ENTER EMPLOYEE PIN
          </span>
        </div>

        <form onSubmit={handlePinSubmit} style={{ display: 'flex', gap: '0.65rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="password"
              placeholder="Enter PIN (e.g. 1234)"
              maxLength={6}
              className="input-control font-mono"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{ paddingLeft: '2.4rem', fontSize: '1rem', letterSpacing: '0.15em' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Authenticate
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span>Encrypted with 256-bit Enterprise SSL Authentication</span>
        </div>
      </div>
    </div>
  );
};

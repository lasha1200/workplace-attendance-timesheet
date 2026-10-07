import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Volume2,
  Clock,
  Sun,
  Moon,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    theme,
    toggleTheme,
    timeFormat,
    toggleTimeFormat,
    soundEnabled,
    toggleSound,
    addToast
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [preferredName, setPreferredName] = useState(currentUser.preferredName || '');
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [workLocation, setWorkLocation] = useState(currentUser.workLocation);
  const [pin, setPin] = useState(currentUser.pin);
  const [emergencyContacts, setEmergencyContacts] = useState(currentUser.emergencyContacts);

  const [newContactName, setNewContactName] = useState('');
  const [newContactRel, setNewContactRel] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      preferredName,
      email,
      phone,
      workLocation,
      pin,
      emergencyContacts
    });
  };

  const handleAddEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    const updated = [
      ...emergencyContacts,
      { name: newContactName, relationship: newContactRel || 'Contact', phone: newContactPhone }
    ];
    setEmergencyContacts(updated);
    setShowAddContact(false);
    setNewContactName('');
    setNewContactRel('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (idx: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}
        className="profile-grid"
      >
        {/* Left Column: Digital Employee Badge Card */}
        <div>
          <div
            className="glass-panel"
            style={{
              padding: '1.75rem 1.5rem',
              textAlign: 'center',
              background: 'linear-gradient(160deg, rgba(22, 31, 48, 0.95) 0%, rgba(13, 19, 33, 0.98) 100%)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary-light)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #0f172a'
                }}
              />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {currentUser.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600, marginBottom: '0.5rem' }}>
              {currentUser.title}
            </div>

            <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.08)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              ID: {currentUser.employeeId}
            </div>

            <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Building size={14} style={{ color: 'var(--text-muted)' }} />
                <span>{currentUser.department}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                <span>{currentUser.workLocation}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                <span>Hired {currentUser.hireDate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <UserCheck size={14} style={{ color: 'var(--text-muted)' }} />
                <span>Manager: {currentUser.manager}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Personal Info Form */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Personal & Contact Information
            </h3>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                    Preferred First Name
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    className="input-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input-control font-mono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                    Primary Work Location
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                    Quick Punch PIN (4-Digits)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    className="input-control font-mono"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Save size={15} />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Emergency Contacts Management */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Emergency Contacts</h3>
              <button
                type="button"
                onClick={() => setShowAddContact(!showAddContact)}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
              >
                <Plus size={13} />
                <span>Add Contact</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {contact.name} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>({contact.relationship})</span>
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', marginTop: '2px' }}>
                      {contact.phone} {contact.email ? `• ${contact.email}` : ''}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveContact(idx)}
                    className="btn btn-ghost"
                    style={{ padding: '4px', color: '#f87171' }}
                    title="Remove Contact"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Contact form */}
            {showAddContact && (
              <form onSubmit={handleAddEmergencyContact} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr', gap: '0.65rem' }}>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    className="input-control"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Relationship (e.g. Spouse)"
                    className="input-control"
                    value={newContactRel}
                    onChange={(e) => setNewContactRel(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="input-control font-mono"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setShowAddContact(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Contact
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Work & App Preferences */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
              Workplace & Display Preferences
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Clock size={16} style={{ color: 'var(--primary-light)' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Clock Format</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timeFormat === '12h' ? '12-Hour AM/PM' : '24-Hour Military'}</div>
                  </div>
                </div>
                <button onClick={toggleTimeFormat} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                  Switch
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Volume2 size={16} style={{ color: 'var(--primary-light)' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Punch Audio FX</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{soundEnabled ? 'Enabled' : 'Muted'}</div>
                  </div>
                </div>
                <button onClick={toggleSound} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                  {soundEnabled ? 'Mute' : 'Enable'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {theme === 'dark' ? <Moon size={16} style={{ color: '#fbbf24' }} /> : <Sun size={16} style={{ color: 'var(--primary)' }} />}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Color Theme</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
                  </div>
                </div>
                <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                  Toggle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import type { ActiveTab } from '../types';
import {
  Clock,
  Calendar,
  DollarSign,
  Landmark,
  UserCheck,
  FileCheck2,
  CalendarDays
} from 'lucide-react';

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, timesheetWeeks, schedules } = useApp();

  const currentWeek = timesheetWeeks.find(w => w.id === 'tw_current');
  const currentTotalHours = currentWeek ? currentWeek.totalHours : 0;
  const upcomingShiftsCount = schedules.filter(s => s.status === 'scheduled').length;

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'timesheet',
      label: 'Timesheet & Clock',
      icon: <Clock size={17} />,
      badge: `${currentTotalHours}h`
    },
    {
      id: 'schedule',
      label: 'Work Schedule',
      icon: <Calendar size={17} />,
      badge: upcomingShiftsCount > 0 ? `${upcomingShiftsCount} shifts` : undefined
    },
    {
      id: 'payroll',
      label: 'Payroll & Earnings',
      icon: <DollarSign size={17} />
    },
    {
      id: 'taxes',
      label: 'Taxes & W-4',
      icon: <Landmark size={17} />
    },
    {
      id: 'profile',
      label: 'Employee Profile',
      icon: <UserCheck size={17} />
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem',
        background: 'var(--bg-card-solid)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}
      className="nav-tabs-container"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: '1 1 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              border: isActive ? '1px solid var(--border-highlight)' : '1px solid transparent',
              background: isActive
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(59, 130, 246, 0.12) 100%)'
                : 'transparent',
              color: isActive ? 'var(--text-main)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              whiteSpace: 'nowrap',
              boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ color: isActive ? 'var(--primary-light)' : 'inherit', display: 'flex', alignItems: 'center' }}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--primary-light)' : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  lineHeight: 1
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PunchCard } from '../components/PunchCard';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Send,
  Download,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Coffee
} from 'lucide-react';

interface TimesheetPageProps {
  onOpenManualPunch: () => void;
}

export const TimesheetPage: React.FC<TimesheetPageProps> = ({ onOpenManualPunch }) => {
  const { timesheetWeeks, submitTimesheet, currentUser, addToast } = useApp();
  const [selectedWeekId, setSelectedWeekId] = useState<string>('tw_current');

  const selectedWeek = timesheetWeeks.find(w => w.id === selectedWeekId) || timesheetWeeks[0];

  const handleExportCSV = () => {
    let csv = `Date,Day,Regular Hours,Overtime Hours,Break (Mins),Total Hours,Gross Earned\n`;
    selectedWeek.days.forEach(d => {
      csv += `${d.date},${d.dayOfWeek},${d.regularHours},${d.overtimeHours},${d.breakMinutes},${d.totalHours},${d.grossEarned}\n`;
    });
    csv += `Total,,${selectedWeek.totalRegularHours},${selectedWeek.totalOvertimeHours},,${selectedWeek.totalHours},${selectedWeek.totalGross}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet_${currentUser.employeeId}_week${selectedWeek.weekNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Timesheet Exported',
      message: `Exported CSV for Week ${selectedWeek.weekNumber} (${selectedWeek.startDate} to ${selectedWeek.endDate})`
    });
  };

  // Progress towards 40 regular hours
  const regularProgress = Math.min(100, Math.round((selectedWeek.totalRegularHours / 40) * 100));

  return (
    <div>
      {/* Primary Punch Station & Real Time Clock */}
      <PunchCard onOpenManualPunch={onOpenManualPunch} />

      {/* Week Navigation & Summary Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              onClick={() => {
                const idx = timesheetWeeks.findIndex(w => w.id === selectedWeekId);
                if (idx < timesheetWeeks.length - 1) setSelectedWeekId(timesheetWeeks[idx + 1].id);
              }}
              disabled={timesheetWeeks.findIndex(w => w.id === selectedWeekId) === timesheetWeeks.length - 1}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.6rem' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => {
                const idx = timesheetWeeks.findIndex(w => w.id === selectedWeekId);
                if (idx > 0) setSelectedWeekId(timesheetWeeks[idx - 1].id);
              }}
              disabled={timesheetWeeks.findIndex(w => w.id === selectedWeekId) === 0}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.6rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Week {selectedWeek.weekNumber}, {selectedWeek.year}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                ({selectedWeek.startDate} – {selectedWeek.endDate})
              </span>
            </h2>
          </div>

          {/* Timesheet Approval Status */}
          <div
            className={`badge ${
              selectedWeek.status === 'Approved'
                ? 'badge-success'
                : selectedWeek.status === 'Submitted'
                ? 'badge-warning'
                : 'badge-neutral'
            }`}
          >
            {selectedWeek.status === 'Approved' && <CheckCircle2 size={13} />}
            {selectedWeek.status === 'Submitted' && <Clock size={13} />}
            <span>{selectedWeek.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary" style={{ gap: '0.4rem' }}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          {selectedWeek.status === 'Draft' && (
            <button
              onClick={() => submitTimesheet(selectedWeek.id)}
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <Send size={15} />
              <span>Submit for Approval</span>
            </button>
          )}

          {selectedWeek.status === 'Submitted' && (
            <div style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              <span>Pending review by {currentUser.manager.split(' ')[0]}</span>
            </div>
          )}

          {selectedWeek.status === 'Approved' && (
            <div style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} />
              <span>Approved by {selectedWeek.approvedBy?.split(' ')[0] || 'Manager'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Hours Logged</span>
            <Clock size={16} style={{ color: 'var(--primary-light)' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-main)' }}>
            {selectedWeek.totalHours.toFixed(1)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>hrs</span>
          </div>
          <div style={{ marginTop: '0.5rem', width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${regularProgress}%`, height: '100%', background: 'var(--primary-light)', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {regularProgress}% of 40h standard target
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Regular Hours</span>
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#10b981' }}>
            {selectedWeek.totalRegularHours.toFixed(1)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>hrs</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Rate: ${currentUser.hourlyRate.toFixed(2)}/hr
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Overtime (1.5x)</span>
            <Zap size={16} style={{ color: '#f59e0b' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: selectedWeek.totalOvertimeHours > 0 ? '#f59e0b' : 'var(--text-main)' }}>
            {selectedWeek.totalOvertimeHours.toFixed(1)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>hrs</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            OT Rate: ${(currentUser.hourlyRate * 1.5).toFixed(2)}/hr
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Projected Gross Pay</span>
            <TrendingUp size={16} style={{ color: '#38bdf8' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
            ${selectedWeek.totalGross.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Calculated before tax withholdings
          </div>
        </div>
      </div>

      {/* Detailed Daily Breakdown Table */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          background: 'var(--bg-card-solid)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          overflowX: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Daily Time Card Log</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Standard 8.0h shift threshold applies for daily overtime calculation
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Day & Date</th>
              <th style={{ padding: '0.75rem 1rem' }}>Punch Activity / Timeline</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Break</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Regular</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Overtime</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Hours</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Gross Pay</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedWeek.days.map((day) => {
              const isToday = day.date === new Date().toISOString().split('T')[0];
              return (
                <tr
                  key={day.date}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isToday ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isToday) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isToday) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {day.dayOfWeek}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {day.date} {isToday && <span className="badge badge-purple" style={{ padding: '1px 5px', fontSize: '0.65rem' }}>TODAY</span>}
                    </div>
                  </td>

                  {/* Punch Timeline preview */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {day.punches.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {day.punches.map((p, pIdx) => {
                          const timeStr = new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <span
                              key={pIdx}
                              style={{
                                fontSize: '0.72rem',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: p.type === 'IN' ? 'rgba(16, 185, 129, 0.15)' : p.type === 'OUT' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: p.type === 'IN' ? '#34d399' : p.type === 'OUT' ? '#f87171' : '#fbbf24',
                                border: '1px solid var(--border-subtle)'
                              }}
                              title={`${p.type}: ${p.jobName || p.jobCode} (${p.location}) ${p.note ? `- ${p.note}` : ''}`}
                            >
                              {p.type === 'IN' && '▶ IN'}
                              {p.type === 'OUT' && '■ OUT'}
                              {p.type === 'BREAK_START' && '☕ BREAK'}
                              {p.type === 'BREAK_END' && '⚡ RESUME'} {timeStr}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No punches recorded
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: 'var(--text-secondary)' }} className="font-mono">
                    {day.breakMinutes > 0 ? `${day.breakMinutes}m` : '—'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }} className="font-mono">
                    {day.regularHours > 0 ? `${day.regularHours.toFixed(1)}h` : '0.0h'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 600, color: day.overtimeHours > 0 ? '#f59e0b' : 'var(--text-muted)' }} className="font-mono">
                    {day.overtimeHours > 0 ? `+${day.overtimeHours.toFixed(1)}h` : '0.0h'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: day.totalHours > 0 ? 'var(--primary-light)' : 'var(--text-muted)' }} className="font-mono">
                    {day.totalHours > 0 ? `${day.totalHours.toFixed(1)}h` : '0.0h'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: day.grossEarned > 0 ? '#34d399' : 'var(--text-muted)' }} className="font-mono">
                    {day.grossEarned > 0 ? `$${day.grossEarned.toFixed(2)}` : '$0.00'}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    {day.status === 'complete' && (
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Complete</span>
                    )}
                    {day.status === 'active' && (
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>In Progress</span>
                    )}
                    {day.status === 'empty' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--border-medium)', fontWeight: 800, background: 'rgba(0,0,0,0.15)' }}>
              <td style={{ padding: '1rem' }} colSpan={2}>
                WEEKLY TOTALS
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }} className="font-mono">
                {selectedWeek.days.reduce((acc, d) => acc + d.breakMinutes, 0)}m
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: '#10b981' }} className="font-mono">
                {selectedWeek.totalRegularHours.toFixed(1)}h
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: selectedWeek.totalOvertimeHours > 0 ? '#f59e0b' : 'inherit' }} className="font-mono">
                {selectedWeek.totalOvertimeHours.toFixed(1)}h
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--primary-light)' }} className="font-mono">
                {selectedWeek.totalHours.toFixed(1)}h
              </td>
              <td style={{ padding: '1rem', textAlign: 'right', color: '#38bdf8', fontSize: '1rem' }} className="font-mono">
                ${selectedWeek.totalGross.toFixed(2)}
              </td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <span className="badge badge-neutral">{selectedWeek.status}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

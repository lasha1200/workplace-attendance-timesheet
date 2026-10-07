import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isWarning = t.type === 'warning';
        const isError = t.type === 'error';

        const iconColor = isSuccess ? '#10b981' : isWarning ? '#f59e0b' : isError ? '#ef4444' : '#06b6d4';

        return (
          <div key={t.id} className="toast-item">
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {isSuccess && <CheckCircle2 size={18} color={iconColor} />}
              {isWarning && <AlertTriangle size={18} color={iconColor} />}
              {isError && <AlertCircle size={18} color={iconColor} />}
              {!isSuccess && !isWarning && !isError && <Info size={18} color={iconColor} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {t.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {t.message}
              </div>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

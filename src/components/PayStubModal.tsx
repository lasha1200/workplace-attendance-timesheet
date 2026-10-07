import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, Building2, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PayStubModal: React.FC = () => {
  const { selectedPayStub, setSelectedPayStub, currentUser, addToast } = useApp();

  if (!selectedPayStub) return null;

  const handlePrint = () => {
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    addToast({
      type: 'success',
      title: 'Pay Stub Downloaded',
      message: `Document ${selectedPayStub.stubNumber} downloaded as encrypted PDF.`
    });
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedPayStub(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '780px',
          background: '#ffffff',
          color: '#1e293b',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Modal Action Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            background: '#0f172a',
            color: '#ffffff',
            borderTopLeftRadius: 'var(--radius-lg)',
            borderTopRightRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <DollarSign size={20} color="#38bdf8" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>
              Official Earnings Statement & Pay Stub
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem'
              }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => setSelectedPayStub(null)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div style={{ padding: '2rem', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}>
          {/* Company & Employee Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                ACME GLOBAL TECHNOLOGIES INC.
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                100 Innovation Way, Suite 500 • San Francisco, CA 94105
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                EIN: 94-8291041 • Payroll Disbursing Office
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Statement ID
              </div>
              <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {selectedPayStub.stubNumber}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                <CheckCircle2 size={13} />
                <span>Paid via Direct Deposit</span>
              </div>
            </div>
          </div>

          {/* Period & Employee Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Employee Name</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {currentUser.employeeId}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Department & Role</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{currentUser.department}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser.title}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Pay Period</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedPayStub.payPeriodStart} to {selectedPayStub.payPeriodEnd}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Semi-Monthly</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Payment Date</div>
              <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedPayStub.payDate}</div>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Settled & Cleared</div>
            </div>
          </div>

          {/* Summary Big Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Gross Earnings</div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', marginTop: '4px' }}>
                ${selectedPayStub.grossPay.toFixed(2)}
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>Total Deductions & Taxes</div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c', marginTop: '4px' }}>
                -${(selectedPayStub.grossPay - selectedPayStub.netPay).toFixed(2)}
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>Net Take-Home Pay</div>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
                ${selectedPayStub.netPay.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Earnings breakdown */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
                EARNINGS BREAKDOWN
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '6px 0' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '6px 0' }}>Hours</th>
                    <th style={{ textAlign: 'right', padding: '6px 0' }}>Rate</th>
                    <th style={{ textAlign: 'right', padding: '6px 0' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 0', fontWeight: 600 }}>Regular Wages</td>
                    <td style={{ textAlign: 'right' }} className="font-mono">{selectedPayStub.regularHours.toFixed(1)}</td>
                    <td style={{ textAlign: 'right' }} className="font-mono">${selectedPayStub.regularRate.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }} className="font-mono">${selectedPayStub.regularPay.toFixed(2)}</td>
                  </tr>
                  {selectedPayStub.overtimeHours > 0 && (
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 0', fontWeight: 600 }}>Overtime (1.5x)</td>
                      <td style={{ textAlign: 'right' }} className="font-mono">{selectedPayStub.overtimeHours.toFixed(1)}</td>
                      <td style={{ textAlign: 'right' }} className="font-mono">${selectedPayStub.overtimeRate.toFixed(2)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }} className="font-mono">${selectedPayStub.overtimePay.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr style={{ fontWeight: 800, borderTop: '1px solid #cbd5e1' }}>
                    <td colSpan={3} style={{ padding: '8px 0' }}>TOTAL GROSS</td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }} className="font-mono">${selectedPayStub.grossPay.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions & Taxes */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', borderBottom: '2px solid #0f172a', paddingBottom: '0.4rem', marginBottom: '0.5rem' }}>
                TAXES & PRE-TAX DEDUCTIONS
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '6px 0' }}>Tax / Deduction Item</th>
                    <th style={{ textAlign: 'right', padding: '6px 0' }}>Current Period</th>
                    <th style={{ textAlign: 'right', padding: '6px 0' }}>YTD Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '5px 0' }}>Federal Income Tax (W-4)</td>
                    <td style={{ textAlign: 'right' }} className="font-mono">-${selectedPayStub.federalTax.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: '#64748b' }} className="font-mono">${selectedPayStub.ytdFederalTax.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '5px 0' }}>Social Security (6.2%)</td>
                    <td style={{ textAlign: 'right' }} className="font-mono">-${selectedPayStub.ficaSocialSecurity.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: '#64748b' }} className="font-mono">${(selectedPayStub.ytdFica * 0.81).toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '5px 0' }}>Medicare (1.45%)</td>
                    <td style={{ textAlign: 'right' }} className="font-mono">-${selectedPayStub.ficaMedicare.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: '#64748b' }} className="font-mono">${(selectedPayStub.ytdFica * 0.19).toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '5px 0' }}>State Withholding Tax</td>
                    <td style={{ textAlign: 'right' }} className="font-mono">-${selectedPayStub.stateTax.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: '#64748b' }} className="font-mono">${selectedPayStub.ytdStateTax.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '5px 0' }}>401(k) Pre-tax (5%)</td>
                    <td style={{ textAlign: 'right' }} className="font-mono">-${selectedPayStub.retirement401k.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: '#64748b' }} className="font-mono">${selectedPayStub.ytd401k.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '5px 0' }}>Healthcare & Vision Plan</td>
                    <td style={{ textAlign: 'right' }} className="font-mono">-${selectedPayStub.healthInsurance.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: '#64748b' }} className="font-mono">${(selectedPayStub.healthInsurance * 19).toFixed(2)}</td>
                  </tr>
                  <tr style={{ fontWeight: 800, borderTop: '1px solid #cbd5e1' }}>
                    <td style={{ padding: '8px 0' }}>TOTAL WITHHOLDINGS</td>
                    <td style={{ textAlign: 'right', padding: '8px 0', color: '#b91c1c' }} className="font-mono">
                      -${(selectedPayStub.grossPay - selectedPayStub.netPay).toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '8px 0' }} className="font-mono">
                      ${(selectedPayStub.ytdGross - selectedPayStub.ytdNet).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Direct Deposit Disbursement Details */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              DIRECT DEPOSIT DISBURSEMENT DETAILS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {selectedPayStub.directDeposits.map((dd, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: '#334155' }}>
                    {dd.bankName} • {dd.accountType}
                  </span>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#059669' }}>
                    ${dd.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { PayStub } from '../types';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Building,
  Shield,
  ArrowUpRight,
  PieChart,
  PlusCircle
} from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const { payStubs, setSelectedPayStub, currentUser, addToast } = useApp();
  const [directDepositList, setDirectDepositList] = useState(currentUser.directDeposits);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'Checking' | 'Savings'>('Checking');
  const [newLast4, setNewLast4] = useState('');
  const [newRouting, setNewRouting] = useState('');
  const [newPercent, setNewPercent] = useState<number>(20);

  const latestStub = payStubs[0];

  const handleAddDirectDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName || !newLast4 || !newRouting) return;

    const newAcc = {
      id: 'dd_' + Date.now(),
      bankName: newBankName,
      accountType: newAccountType,
      last4: newLast4,
      routingNumber: newRouting,
      percentage: Number(newPercent),
      isPrimary: false
    };

    setDirectDepositList([...directDepositList, newAcc]);
    setShowAddAccount(false);
    setNewBankName('');
    setNewLast4('');
    setNewRouting('');

    addToast({
      type: 'success',
      title: 'Direct Deposit Added',
      message: `${newBankName} (...${newLast4}) configured for ${newPercent}% allocation.`
    });
  };

  return (
    <div>
      {/* Top Banner: Compensation Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Base Hourly Wage</span>
            <DollarSign size={16} style={{ color: 'var(--primary-light)' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-main)' }}>
            ${currentUser.hourlyRate.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/hr</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            ≈ ${(currentUser.hourlyRate * 2080).toLocaleString()} annualized
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Overtime Rate (1.5x)</span>
            <ArrowUpRight size={16} style={{ color: '#f59e0b' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#f59e0b' }}>
            ${(currentUser.hourlyRate * 1.5).toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/hr</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Applies after 8.0h daily or 40h weekly
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Last Paycheck (Net)</span>
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#10b981' }}>
            ${latestStub.netPay.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Paid on {latestStub.payDate}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Year-to-Date Gross</span>
            <TrendingUp size={16} style={{ color: '#38bdf8' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.35rem', color: '#38bdf8' }}>
            ${latestStub.ytdGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            YTD Net: ${latestStub.ytdNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Pay Stubs History Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Official Pay Stubs & Statements</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Select a pay stub to view full breakdown, tax withholdings, and printable receipt
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Statement Number</th>
                <th style={{ padding: '0.75rem 1rem' }}>Pay Period</th>
                <th style={{ padding: '0.75rem 1rem' }}>Disbursement Date</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Gross Pay</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Deductions</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Net Take-Home</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payStubs.map((stub) => {
                const totalDeductions = stub.grossPay - stub.netPay;
                return (
                  <tr
                    key={stub.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => setSelectedPayStub(stub)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-light)' }}>
                        {stub.stubNumber}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Regular: {stub.regularHours}h • OT: {stub.overtimeHours}h
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      {stub.payPeriodStart} – {stub.payPeriodEnd}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {stub.payDate}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }} className="font-mono">
                      ${stub.grossPay.toFixed(2)}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#f87171' }} className="font-mono">
                      -${totalDeductions.toFixed(2)}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#34d399' }} className="font-mono">
                      ${stub.netPay.toFixed(2)}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => setSelectedPayStub(stub)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '0.25rem' }}
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Deposit Settings */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={18} style={{ color: 'var(--primary-light)' }} />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Direct Deposit Bank Accounts</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Earnings are automatically split and disbursed via ACH electronic direct deposit
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddAccount(!showAddAccount)}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem' }}
          >
            <PlusCircle size={14} />
            <span>Add Bank Account</span>
          </button>
        </div>

        {/* Existing accounts list */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {directDepositList.map((acc) => (
            <div
              key={acc.id}
              style={{
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={15} style={{ color: 'var(--primary-light)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{acc.bankName}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {acc.accountType} (•••• {acc.last4})
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Routing: {acc.routingNumber}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                  {acc.percentage}% Allocation
                </span>
                {acc.isPrimary && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Primary Account
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Account Form Drawer */}
        {showAddAccount && (
          <form
            onSubmit={handleAddDirectDeposit}
            style={{
              padding: '1.25rem',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Link New Direct Deposit Account</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. Citibank N.A."
                  className="input-control"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Account Type</label>
                <select
                  className="input-control"
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as 'Checking' | 'Savings')}
                >
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Account Last 4</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  className="input-control font-mono"
                  value={newLast4}
                  onChange={(e) => setNewLast4(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>Routing Number</label>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="021000021"
                  className="input-control font-mono"
                  value={newRouting}
                  onChange={(e) => setNewRouting(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowAddAccount(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

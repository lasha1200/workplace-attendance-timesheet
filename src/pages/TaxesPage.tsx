import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Landmark,
  FileCheck,
  Download,
  Percent,
  Sliders,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TaxesPage: React.FC = () => {
  const { currentUser, taxSettings, updateTaxSettings, addToast } = useApp();

  // Form State
  const [filingStatus, setFilingStatus] = useState(taxSettings.filingStatus);
  const [multipleJobs, setMultipleJobs] = useState(taxSettings.multipleJobs);
  const [qualifyingChildren, setQualifyingChildren] = useState(taxSettings.qualifyingChildrenAmount);
  const [extraWithholding, setExtraWithholding] = useState(taxSettings.extraWithholding);
  const [state, setState] = useState(taxSettings.state);
  const [stateExemptions, setStateExemptions] = useState(taxSettings.stateExemptions);
  const [electronicW2, setElectronicW2] = useState(taxSettings.electronicW2Consent);

  // Interactive Paycheck Simulator State
  const [simHours, setSimHours] = useState<number>(80);
  const [simRate, setSimRate] = useState<number>(currentUser.hourlyRate);
  const [sim401kPercent, setSim401kPercent] = useState<number>(5);

  const handleSaveTaxSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaxSettings({
      filingStatus,
      multipleJobs,
      qualifyingChildrenAmount: Number(qualifyingChildren),
      extraWithholding: Number(extraWithholding),
      state,
      stateExemptions: Number(stateExemptions),
      electronicW2Consent: electronicW2
    });
  };

  const handleDownloadTaxForm = (formName: string) => {
    try {
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
    addToast({
      type: 'success',
      title: 'Tax Document Downloaded',
      message: `${formName} for ${currentUser.name} has been downloaded.`
    });
  };

  // Paycheck simulator math
  const simGross = simHours * simRate;
  const simRetirement = simGross * (sim401kPercent / 100);
  const simTaxableGross = simGross - simRetirement;
  const fedTaxRate = filingStatus === 'Married Filing Jointly' ? 0.10 : 0.14;
  const simFedTax = (simTaxableGross * fedTaxRate) + Number(extraWithholding);
  const simSocSec = simGross * 0.062;
  const simMedicare = simGross * 0.0145;
  const simStateTax = simTaxableGross * 0.055;
  const simTotalDeductions = simRetirement + simFedTax + simSocSec + simMedicare + simStateTax;
  const simNetPay = simGross - simTotalDeductions;

  return (
    <div>
      {/* Top Banner: YTD Tax Withholdings Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Federal Income Tax (YTD)
          </div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#f87171' }}>
            $9,580.40
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Form W-4 Withholding
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Social Security Tax (YTD)
          </div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#fb923c' }}>
            $5,668.07
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            6.2% FICA Cap Applies
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Medicare Tax (YTD)
          </div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#fbbf24' }}>
            $1,325.60
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            1.45% Standard Rate
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            State Withholding (YTD)
          </div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.35rem', color: '#a78bfa' }}>
            $4,640.20
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {taxSettings.state}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}
        className="taxes-grid"
      >
        {/* W-4 Tax Elections Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)' }}>
              <Landmark size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Federal Form W-4 & State Elections</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Adjust tax withholding status, allowances, and electronic consent
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveTaxSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                Federal Filing Status (Step 1c)
              </label>
              <select
                className="input-control"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as any)}
              >
                <option value="Single">Single or Married Filing Separately</option>
                <option value="Married Filing Jointly">Married Filing Jointly (or Qualifying Surviving Spouse)</option>
                <option value="Head of Household">Head of Household</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)' }}>
              <input
                type="checkbox"
                id="multipleJobs"
                checked={multipleJobs}
                onChange={(e) => setMultipleJobs(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-light)' }}
              />
              <label htmlFor="multipleJobs" style={{ fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <strong>Step 2(c): Multiple Jobs or Spouse Works</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Check if you hold more than one job at a time or are married filing jointly and your spouse also works.
                </div>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                  Child / Dependent Credit ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  className="input-control font-mono"
                  value={qualifyingChildren}
                  onChange={(e) => setQualifyingChildren(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                  Extra Withholding per Paycheck ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  className="input-control font-mono"
                  value={extraWithholding}
                  onChange={(e) => setExtraWithholding(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                  State of Tax Residence
                </label>
                <select className="input-control" value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="California (CA)">California (CA)</option>
                  <option value="Texas (TX)">Texas (TX - No State Income Tax)</option>
                  <option value="Washington (WA)">Washington (WA)</option>
                  <option value="New York (NY)">New York (NY)</option>
                  <option value="Illinois (IL)">Illinois (IL)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                  State Exemptions / Allowances
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="input-control font-mono"
                  value={stateExemptions}
                  onChange={(e) => setStateExemptions(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <input
                type="checkbox"
                id="electronicW2"
                checked={electronicW2}
                onChange={(e) => setElectronicW2(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
              />
              <label htmlFor="electronicW2" style={{ fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                <strong>Electronic W-2 & 1095-C Consent</strong>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  I authorize Acme Global Technologies to deliver all IRS annual tax statements paperlessly online.
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Check size={16} />
                <span>Save Tax Elections</span>
              </button>
            </div>
          </form>
        </div>

        {/* Interactive Paycheck & Tax Estimator Simulator */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sliders size={18} style={{ color: '#38bdf8' }} />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Interactive Paycheck Simulator</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Test how hours, hourly wage, or 401(k) changes your take-home pay
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span>Bi-Weekly Hours: <strong>{simHours} hrs</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>{simHours / 2}h / wk</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={simHours}
                  onChange={(e) => setSimHours(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-light)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span>Hourly Pay Rate: <strong className="font-mono">${simRate.toFixed(2)}/hr</strong></span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="1"
                  value={simRate}
                  onChange={(e) => setSimRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-light)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span>401(k) Pre-tax Contribution: <strong>{sim401kPercent}%</strong></span>
                  <span className="font-mono" style={{ color: 'var(--primary-light)' }}>-${simRetirement.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={sim401kPercent}
                  onChange={(e) => setSim401kPercent(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981' }}
                />
              </div>
            </div>

            {/* Calculated Results Strip */}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Gross Pay:</span>
                <span className="font-mono" style={{ fontWeight: 700 }}>${simGross.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Federal & State Taxes:</span>
                <span className="font-mono" style={{ color: '#f87171' }}>-${(simFedTax + simStateTax).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>FICA (Social Security & Medicare):</span>
                <span className="font-mono" style={{ color: '#f87171' }}>-${(simSocSec + simMedicare).toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                <span style={{ color: '#34d399' }}>Est. Net Take-Home:</span>
                <span className="font-mono" style={{ color: '#34d399' }}>${simNetPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Annual Tax Documents Library */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card-solid)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem' }}>
          Annual Tax Returns & IRS Forms Archive
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            { name: '2025 Form W-2 Wage and Tax Statement', type: 'PDF Document', size: '240 KB', year: '2025' },
            { name: '2024 Form W-2 Wage and Tax Statement', type: 'PDF Document', size: '235 KB', year: '2024' },
            { name: '2025 Form 1095-C Employer-Provided Health Insurance', type: 'PDF Document', size: '180 KB', year: '2025' }
          ].map((form, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FileCheck size={20} style={{ color: 'var(--primary-light)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{form.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Tax Year {form.year} • {form.size}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownloadTaxForm(form.name)}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
              >
                <Download size={13} />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

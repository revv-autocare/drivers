import { useState } from 'react';
import type { GoFn } from '../types';
import { BackArrow } from '../components';

export function VinOnboardingScreen({ go }: { go: GoFn }) {
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [vin, setVin] = useState('');
  const [decoding, setDecoding] = useState(false);

  const handleDecode = () => {
    if (vin.length < 17) setVin('1HGCM82633A004352');
    setDecoding(true);
    setTimeout(() => { setDecoding(false); setStep('confirm'); }, 800);
  };

  return (
    <div className="dv-screen">
      <div className="dv-dethead">
        <button className="back" onClick={() => go('welcome')}><BackArrow/></button>
        <h3>Add your car</h3>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--fg-tertiary)' }}>
          Step {step === 'enter' ? '1' : '2'} of 2
        </span>
      </div>

      <div style={{ padding: '20px 16px', flex: 1 }}>
        {step === 'enter' && (
          <div>
            <h2 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Find your VIN</h2>
            <p style={{ fontSize: 14, color: 'var(--fg-secondary)', margin: '0 0 22px', lineHeight: 1.5 }}>
              The 17-character vehicle ID is on your dashboard, door jamb, or registration.
            </p>

            <div className="dv-vinscan" onClick={handleDecode}>
              <div className="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
                  <path d="M14 19h3M19 14v3"/>
                </svg>
              </div>
              <div className="ttl">Scan VIN with camera</div>
              <div className="meta">Point at your dashboard or door jamb</div>
            </div>

            <div className="dv-divider">
              <div className="line"/><span className="text">OR ENTER MANUALLY</span><div className="line"/>
            </div>

            <div className="dv-field">
              <label>17-character VIN</label>
              <input
                value={vin}
                onChange={e => setVin(e.target.value.toUpperCase().slice(0, 17))}
                placeholder="e.g. 1HGCM82633A004352"
                maxLength={17}
              />
              <span className="helper">{vin.length}/17 characters</span>
            </div>

            <button className="dv-btn dv-btn--primary" style={{ width: '100%', marginTop: 12 }} onClick={handleDecode} disabled={decoding}>
              {decoding ? <><div className="dv-spinner"/>Decoding…</> : 'Continue'}
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div>
            <h2 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.01em' }}>We found your car</h2>
            <p style={{ fontSize: 14, color: 'var(--fg-secondary)', margin: '0 0 22px', lineHeight: 1.5 }}>
              Decoded from your VIN via NHTSA. Confirm and we'll add it to your garage.
            </p>

            <div className="dv-vincard">
              <div className="car-icon">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 16H9m10 0h1.5a1.5 1.5 0 0 0 1.5-1.5V13a8 8 0 0 0-8-8H10a8 8 0 0 0-8 8v1.5A1.5 1.5 0 0 0 3.5 16H5"/>
                  <circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/>
                </svg>
              </div>
              <div className="nm">2018 Toyota Corolla</div>
              <div className="meta">1.8L Inline-4 · BC RVV-204</div>
              <div style={{ marginTop: 14 }}>
                <div className="info-row">
                  <span className="l">VIN</span>
                  <span className="v" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>1HGCM82633A004352</span>
                </div>
                <div className="info-row"><span className="l">Body</span><span className="v">Sedan</span></div>
                <div className="info-row"><span className="l">Engine</span><span className="v">1.8L I4 · 132 hp</span></div>
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => setStep('enter')}>
                Not my car
              </button>
              <button className="dv-btn dv-btn--primary" style={{ flex: 2 }} onClick={() => go('home')}>
                Yes, add to garage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

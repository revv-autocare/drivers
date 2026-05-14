import { useState } from 'react';
import type { GoFn } from '../types';
import type { DecodedVin } from '../api';
import { decodeVin } from '../api';
import { useStore } from '../store';
import { BackArrow } from '../components';

type Step = 'enter' | 'confirm' | 'manual';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1979 }, (_, i) => CURRENT_YEAR - i);

export function VinOnboardingScreen({ go }: { go: GoFn }) {
  const { addVehicle } = useStore();

  const [step,     setStep]     = useState<Step>('enter');
  const [vin,      setVin]      = useState('');
  const [plate,    setPlate]    = useState('');
  const [mileage,  setMileage]  = useState('');
  const [decoded,  setDecoded]  = useState<DecodedVin | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [errMsg,   setErrMsg]   = useState('');

  // Manual entry fields
  const [manYear,  setManYear]  = useState(String(CURRENT_YEAR));
  const [manMake,  setManMake]  = useState('');
  const [manModel, setManModel] = useState('');
  const [manPlate, setManPlate] = useState('');
  const [manColor, setManColor] = useState('');
  const [manKm,    setManKm]    = useState('');

  const stepLabel = step === 'enter' ? '1' : step === 'confirm' ? '2' : '1';

  const handleDecode = async () => {
    const raw = vin.trim();
    if (raw.length < 17) {
      setErrMsg('VIN must be 17 characters.');
      return;
    }
    setErrMsg('');
    setLoading(true);
    try {
      const result = await decodeVin(raw);
      setDecoded(result);
      setStep('confirm');
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Could not decode VIN. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanDemo = async () => {
    setVin('1HGCM82633A004352');
    setErrMsg('');
    setLoading(true);
    try {
      const result = await decodeVin('1HGCM82633A004352');
      setDecoded(result);
      setStep('confirm');
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Demo VIN decode failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!decoded) return;
    setSaving(true);
    setErrMsg('');
    try {
      await addVehicle({
        vin: vin.trim().toUpperCase(),
        year: decoded.year,
        make: decoded.make,
        model: decoded.model,
        engine: decoded.engine,
        plate: plate.trim().toUpperCase() || 'BC ???-???',
        mileage: parseInt(mileage.replace(/\D/g, ''), 10) || 0,
      });
      go('home');
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to save vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!manMake.trim() || !manModel.trim()) {
      setErrMsg('Please enter the make and model.');
      return;
    }
    setSaving(true);
    setErrMsg('');
    try {
      const manVehicle: Parameters<typeof addVehicle>[0] = {
        vin: '',
        year: parseInt(manYear, 10),
        make: manMake.trim(),
        model: manModel.trim(),
        engine: '',
        plate: manPlate.trim().toUpperCase() || 'BC ???-???',
        mileage: parseInt(manKm.replace(/\D/g, ''), 10) || 0,
      };
      if (manColor.trim()) manVehicle.color = manColor.trim();
      await addVehicle(manVehicle);
      go('home');
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to save vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dv-screen">
      <div className="dv-dethead">
        <button
          className="back"
          onClick={() => {
            if (step === 'confirm') { setStep('enter'); return; }
            if (step === 'manual')  { setStep('enter'); return; }
          }}
        >
          <BackArrow/>
        </button>
        <h3>Add your car</h3>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--fg-tertiary)' }}>
          Step {stepLabel} of 2
        </span>
      </div>

      <div style={{ padding: '20px 16px', flex: 1, overflowY: 'auto' }}>

        {/* ── Step 1: Enter / scan VIN ─────────────────────── */}
        {step === 'enter' && (
          <div>
            <h2 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Find your VIN</h2>
            <p style={{ fontSize: 14, color: 'var(--fg-secondary)', margin: '0 0 22px', lineHeight: 1.5 }}>
              The 17-character vehicle ID is on your dashboard, door jamb, or registration.
            </p>

            <div className="dv-vinscan" onClick={handleScanDemo}>
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
                onChange={e => { setVin(e.target.value.toUpperCase().slice(0, 17)); setErrMsg(''); }}
                placeholder="e.g. 1HGCM82633A004352"
                maxLength={17}
                autoComplete="off"
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '.08em' }}
              />
              <span className="helper" style={{ color: errMsg ? 'var(--color-error-600)' : undefined }}>
                {errMsg || `${vin.length}/17 characters`}
              </span>
            </div>

            <button
              className="dv-btn dv-btn--primary"
              style={{ width: '100%', marginTop: 12 }}
              onClick={handleDecode}
              disabled={loading || vin.length < 17}
            >
              {loading ? <><div className="dv-spinner"/>Decoding…</> : 'Continue'}
            </button>

            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <span
                onClick={() => { setErrMsg(''); setStep('manual'); }}
                style={{ fontSize: 13, color: 'var(--color-brand-600)', cursor: 'pointer', fontWeight: 500 }}
              >
                Don't have your VIN? Enter details instead →
              </span>
            </div>
          </div>
        )}

        {/* ── Step 2: Confirm + enter plate & mileage ──────── */}
        {step === 'confirm' && decoded && (
          <div>
            <h2 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.01em' }}>We found your car</h2>
            <p style={{ fontSize: 14, color: 'var(--fg-secondary)', margin: '0 0 22px', lineHeight: 1.5 }}>
              Decoded via NHTSA. Confirm the details below and we'll add it to your garage.
            </p>

            <div className="dv-vincard">
              <div className="car-icon">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 16H9m10 0h1.5a1.5 1.5 0 0 0 1.5-1.5V13a8 8 0 0 0-8-8H10a8 8 0 0 0-8 8v1.5A1.5 1.5 0 0 0 3.5 16H5"/>
                  <circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/>
                </svg>
              </div>
              <div className="nm">{decoded.year} {decoded.make} {decoded.model}</div>
              <div className="meta">{decoded.engine || 'Engine TBD'}</div>
              <div style={{ marginTop: 14 }}>
                <div className="info-row">
                  <span className="l">VIN</span>
                  <span className="v" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{vin.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="dv-field" style={{ marginTop: 18 }}>
              <label>Licence plate <span style={{ fontWeight: 400, color: 'var(--fg-tertiary)' }}>(optional)</span></label>
              <input
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase().slice(0, 10))}
                placeholder="e.g. BC RVV-204"
              />
            </div>

            <div className="dv-field">
              <label>Current mileage (km) <span style={{ fontWeight: 400, color: 'var(--fg-tertiary)' }}>(optional)</span></label>
              <input
                value={mileage}
                onChange={e => setMileage(e.target.value.replace(/\D/g, '').slice(0, 7))}
                placeholder="e.g. 84120"
                inputMode="numeric"
              />
            </div>

            {errMsg && (
              <div style={{ fontSize: 13, color: 'var(--color-error-600)', marginBottom: 12 }}>{errMsg}</div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => setStep('enter')}>
                Not my car
              </button>
              <button className="dv-btn dv-btn--primary" style={{ flex: 2 }} onClick={handleConfirm} disabled={saving}>
                {saving ? <><div className="dv-spinner"/>Saving…</> : 'Yes, add to garage'}
              </button>
            </div>
          </div>
        )}

        {/* ── Manual entry: no VIN required ────────────────── */}
        {step === 'manual' && (
          <div>
            <h2 style={{ fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Enter car details</h2>
            <p style={{ fontSize: 14, color: 'var(--fg-secondary)', margin: '0 0 22px', lineHeight: 1.5 }}>
              Fill in what you know — you can always edit these later from your garage.
            </p>

            <div className="dv-field">
              <label>Year</label>
              <select
                value={manYear}
                onChange={e => setManYear(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border-field)', borderRadius: 10, fontSize: 15, background: '#fff', appearance: 'none', cursor: 'pointer' }}
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="dv-field">
              <label>Make</label>
              <input
                value={manMake}
                onChange={e => setManMake(e.target.value)}
                placeholder="e.g. Toyota"
                autoCapitalize="words"
              />
            </div>

            <div className="dv-field">
              <label>Model</label>
              <input
                value={manModel}
                onChange={e => setManModel(e.target.value)}
                placeholder="e.g. Corolla"
                autoCapitalize="words"
              />
            </div>

            <div className="dv-field">
              <label>Colour <span style={{ fontWeight: 400, color: 'var(--fg-tertiary)' }}>(optional)</span></label>
              <input
                value={manColor}
                onChange={e => setManColor(e.target.value)}
                placeholder="e.g. Silver"
                autoCapitalize="words"
              />
            </div>

            <div className="dv-field">
              <label>Licence plate <span style={{ fontWeight: 400, color: 'var(--fg-tertiary)' }}>(optional)</span></label>
              <input
                value={manPlate}
                onChange={e => setManPlate(e.target.value.toUpperCase().slice(0, 10))}
                placeholder="e.g. BC RVV-204"
              />
            </div>

            <div className="dv-field">
              <label>Current mileage (km) <span style={{ fontWeight: 400, color: 'var(--fg-tertiary)' }}>(optional)</span></label>
              <input
                value={manKm}
                onChange={e => { setManKm(e.target.value.replace(/\D/g, '').slice(0, 7)); setErrMsg(''); }}
                placeholder="e.g. 84120"
                inputMode="numeric"
              />
            </div>

            {errMsg && (
              <div style={{ fontSize: 13, color: 'var(--color-error-600)', marginBottom: 12 }}>{errMsg}</div>
            )}

            <button
              className="dv-btn dv-btn--primary"
              style={{ width: '100%', marginTop: 8 }}
              onClick={handleManualSave}
              disabled={saving}
            >
              {saving ? <><div className="dv-spinner"/>Saving…</> : 'Add to garage'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

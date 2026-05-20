import { useState, useEffect, useRef } from 'react';
import type { GoFn, ServiceDraftMode, ServiceDraftFields } from '../types';
import { useStore, buildExtractedDraft } from '../store';
import { BackArrow, DetailHead } from '../components';

// ═══════════ ADD SERVICE — INPUT OPTIONS ══════════════════════════
export function AddServiceInputScreen({ go }: { go: GoFn }) {
  const { setServiceDraft } = useStore();
  const [mode, setMode] = useState<ServiceDraftMode | null>(null);

  const startProcessing = (chosenMode: ServiceDraftMode, payload: { preview?: string; text?: string } = {}) => {
    setServiceDraft({
      mode: chosenMode,
      sourcePreview: payload.preview ?? null,
      rawInput: payload.text ?? null,
    });
    go('add-service-processing');
  };

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title="Add service" onBack={() => go(-1)}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 24px' }}>
        {mode === null && (
          <>
            <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>
              How would you like to log it?
            </h2>
            <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
              Hand us anything — a receipt, a quick note, even just a voice memo. We'll pull out the details.
            </p>

            <div className="dv-add-options">
              <div className="dv-add-card featured" onClick={() => setMode('photo')}>
                <div className="dv-add-card__ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div className="dv-add-card__body">
                  <div className="dv-add-card__ttl">Take a photo <span className="rec-pill">Fastest</span></div>
                  <div className="dv-add-card__desc">Snap your receipt, invoice, or quote</div>
                </div>
                <div className="dv-add-card__arrow"><BackArrow/></div>
              </div>

              <div className="dv-add-card" onClick={() => setMode('gallery')}>
                <div className="dv-add-card__ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div className="dv-add-card__body">
                  <div className="dv-add-card__ttl">Upload from gallery</div>
                  <div className="dv-add-card__desc">Pick a photo or PDF you already saved</div>
                </div>
                <div className="dv-add-card__arrow"><BackArrow/></div>
              </div>

              <div className="dv-add-card" onClick={() => setMode('text')}>
                <div className="dv-add-card__ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>
                  </svg>
                </div>
                <div className="dv-add-card__body">
                  <div className="dv-add-card__ttl">Paste or type</div>
                  <div className="dv-add-card__desc">"Got my brakes done at Midas last Tuesday, $340"</div>
                </div>
                <div className="dv-add-card__arrow"><BackArrow/></div>
              </div>

              <div className="dv-add-card" onClick={() => setMode('voice')}>
                <div className="dv-add-card__ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </div>
                <div className="dv-add-card__body">
                  <div className="dv-add-card__ttl">Voice note</div>
                  <div className="dv-add-card__desc">Just talk through what you had done</div>
                </div>
                <div className="dv-add-card__arrow"><BackArrow/></div>
              </div>
            </div>

            <div className="dv-add-manual-link">
              Prefer the old way? <a onClick={() => go('add-service-manual')}>Enter manually instead</a>
            </div>
          </>
        )}

        {(mode === 'photo' || mode === 'gallery') && (
          <PhotoCapture
            isGallery={mode === 'gallery'}
            onBack={() => setMode(null)}
            onCapture={() => startProcessing(mode, { preview: 'receipt' })}
          />
        )}
        {mode === 'text' && (
          <TextComposer
            onBack={() => setMode(null)}
            onSend={(text) => startProcessing('text', { text })}
          />
        )}
        {mode === 'voice' && (
          <VoiceComposer
            onBack={() => setMode(null)}
            onDone={() => startProcessing('voice')}
          />
        )}
      </div>
    </div>
  );
}

function PhotoCapture({ isGallery, onBack, onCapture }: { isGallery: boolean; onBack: () => void; onCapture: () => void }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button className="dv-btn dv-btn--ghost-icon" style={{ width: 36, height: 36, padding: 0 }} onClick={onBack}>
          <BackArrow/>
        </button>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{isGallery ? 'Choose from gallery' : 'Take a photo'}</h3>
      </div>

      <div style={{ background: '#1B2649', borderRadius: 14, height: 340, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderTop: '2px solid #fff', borderLeft: '2px solid #fff', borderRadius: '3px 0 0 0' }}/>
        <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderTop: '2px solid #fff', borderRight: '2px solid #fff', borderRadius: '0 3px 0 0' }}/>
        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 28, height: 28, borderBottom: '2px solid #fff', borderLeft: '2px solid #fff', borderRadius: '0 0 0 3px' }}/>
        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 28, height: 28, borderBottom: '2px solid #fff', borderRight: '2px solid #fff', borderRadius: '0 0 3px 0' }}/>

        <div style={{ width: 130, height: 200, background: '#fff', borderRadius: 6, padding: 12, transform: 'rotate(-3deg)', boxShadow: '0 10px 30px rgba(0,0,0,.4)' }}>
          <div style={{ height: 8, background: '#e6e9f0', borderRadius: 2, marginBottom: 6, width: '60%' }}/>
          <div style={{ height: 5, background: '#eef0f5', borderRadius: 2, marginBottom: 4, width: '80%' }}/>
          <div style={{ height: 5, background: '#eef0f5', borderRadius: 2, marginBottom: 12, width: '50%' }}/>
          <div style={{ height: 4, background: '#f1f3f8', borderRadius: 2, marginBottom: 3 }}/>
          <div style={{ height: 4, background: '#f1f3f8', borderRadius: 2, marginBottom: 3, width: '85%' }}/>
          <div style={{ height: 4, background: '#f1f3f8', borderRadius: 2, marginBottom: 3, width: '70%' }}/>
          <div style={{ height: 4, background: '#f1f3f8', borderRadius: 2, marginBottom: 3 }}/>
          <div style={{ height: 4, background: '#f1f3f8', borderRadius: 2, marginBottom: 12, width: '60%' }}/>
          <div style={{ height: 8, background: 'var(--color-brand-200)', borderRadius: 2, marginLeft: 'auto', width: '45%' }}/>
        </div>

        <div style={{ position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>
          {isGallery ? 'Tap the photo to use it' : 'Fit the whole receipt in the frame'}
        </div>
      </div>

      <button className="dv-btn dv-btn--primary" style={{ width: '100%' }} onClick={onCapture}>
        {isGallery ? 'Use this photo' : 'Capture'}
      </button>
    </>
  );
}

function TextComposer({ onBack, onSend }: { onBack: () => void; onSend: (text: string) => void }) {
  const [text, setText] = useState('');
  const examples = [
    'Got my brakes done at Midas last Tuesday, $340',
    'Oil change at Egban Autos this morning — $79, 78,420 km',
    'Replaced battery at Canadian Tire on Friday, $195',
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button className="dv-btn dv-btn--ghost-icon" style={{ width: 36, height: 36, padding: 0 }} onClick={onBack}>
          <BackArrow/>
        </button>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Tell us what happened</h3>
      </div>

      <div className="dv-paste-composer">
        <textarea
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="e.g. Got my brakes done at Midas last Tuesday, $340..."
        />
        <div className="examples">
          {examples.map((ex, i) => (
            <span key={i} className="chip" onClick={() => setText(ex)}>{ex.length > 38 ? ex.slice(0, 36) + '…' : ex}</span>
          ))}
        </div>
      </div>

      <button
        className="dv-btn dv-btn--primary"
        style={{ width: '100%', marginTop: 14 }}
        disabled={text.trim().length < 4}
        onClick={() => onSend(text)}
      >
        Extract details
      </button>
    </>
  );
}

function VoiceComposer({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button className="dv-btn dv-btn--ghost-icon" style={{ width: 36, height: 36, padding: 0 }} onClick={onBack}>
          <BackArrow/>
        </button>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Voice note</h3>
      </div>

      <div className="dv-voice-composer">
        <div className={'dv-voice-pulse ' + (recording ? 'recording' : '')} onClick={() => setRecording(r => !r)}>
          {recording ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </div>

        <div className="dv-voice-time">{fmt(seconds)}</div>

        {recording ? (
          <div className="dv-voice-bars" aria-hidden="true">
            <span/><span/><span/><span/><span/><span/>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-secondary)', textAlign: 'center', maxWidth: 240, lineHeight: 1.5 }}>
            {seconds === 0
              ? 'Tap to record. Say what was done, where, and roughly when.'
              : 'Recording paused. Tap to continue, or use below.'}
          </p>
        )}
      </div>

      {seconds > 0 && !recording && (
        <button className="dv-btn dv-btn--primary" style={{ width: '100%', marginTop: 14 }} onClick={onDone}>
          Extract details
        </button>
      )}
    </>
  );
}

// ═══════════ ADD SERVICE — PROCESSING ══════════════════════════════
export function AddServiceProcessingScreen({ go }: { go: GoFn }) {
  const { serviceDraft, setServiceDraft, tweaks } = useStore();
  const [step, setStep] = useState(0);

  const messages = serviceDraft?.mode === 'voice'
    ? ['Listening to your note…', 'Identifying details…', 'Cross-checking your shops…', 'Almost done…']
    : serviceDraft?.mode === 'text'
      ? ['Reading what you wrote…', 'Identifying the shop…', 'Pulling the date and amount…', 'Almost done…']
      : ['Reading your receipt…', 'Identifying the shop…', 'Extracting line items…', 'Almost done…'];

  useEffect(() => {
    if (!serviceDraft) {
      go('add-service');
      return;
    }
    const timers = messages.map((_, i) => setTimeout(() => setStep(i), i * 650));
    const final = setTimeout(() => {
      const result = buildExtractedDraft(serviceDraft.mode, tweaks.extractionConfidence);
      const merged = { ...serviceDraft, ...result };
      if (result.confidence === 'fail') {
        setServiceDraft({ ...merged, failed: true });
        go('add-service-manual');
      } else {
        setServiceDraft(merged);
        go('add-service-confirm');
      }
    }, messages.length * 650 + 200);
    return () => { timers.forEach(clearTimeout); clearTimeout(final); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title="Add service" onBack={() => go('add-service')}/>

      <div className="dv-scan-stage">
        <div className="dv-scan-doc">
          <div className="dv-scan-doc__lines">
            <div className="dv-scan-doc__line heading"/>
            <div className="dv-scan-doc__line short"/>
            <div className="dv-scan-doc__line mid"/>
            <div className="dv-scan-doc__line full"/>
            <div className="dv-scan-doc__line full"/>
            <div className="dv-scan-doc__line mid"/>
            <div className="dv-scan-doc__line short"/>
            <div className="dv-scan-doc__line full"/>
            <div className="dv-scan-doc__line mid"/>
            <div className="dv-scan-doc__line total"/>
          </div>
          <div className="dv-scan-doc__found" style={{ top: 96 }}>Found: shop</div>
        </div>

        <div className="dv-scan-status">
          <div className="dv-scan-status__ttl">Hold tight</div>
          <div className="dv-scan-status__msg" key={step}>{messages[step]}</div>
          <div className="dv-scan-steps">
            {messages.map((_, i) => (
              <div key={i} className={'dot ' + (i < step ? 'done' : i === step ? 'on' : '')}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function sourceLabel(mode: ServiceDraftMode): string {
  switch (mode) {
    case 'photo':   return 'receipt photo';
    case 'gallery': return 'uploaded image';
    case 'text':    return 'description';
    case 'voice':   return 'voice note';
    default:        return 'input';
  }
}

// ═══════════ ADD SERVICE — CONFIRM ════════════════════════════════
export function AddServiceConfirmScreen({ go }: { go: GoFn }) {
  const { serviceDraft, setServiceDraft, addServiceEntry, vehicle } = useStore();
  const [fields, setFields] = useState<ServiceDraftFields>(() =>
    serviceDraft?.fields ?? {
      date: '', shop: '', shopId: null, what: '',
      category: 'other', mileage: 0, cost: 0, notes: '', lineItems: [],
    }
  );
  const [editing, setEditing] = useState<keyof ServiceDraftFields | null>(null);
  const [lineOpen, setLineOpen] = useState(false);
  const isLow = serviceDraft?.confidence === 'low';
  const missing = serviceDraft?.missingFields ?? [];

  useEffect(() => {
    if (!serviceDraft) go('add-service');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!serviceDraft || !vehicle) return null;

  const setField = <K extends keyof ServiceDraftFields>(key: K, val: ServiceDraftFields[K]) =>
    setFields(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    const id = addServiceEntry({
      date: fields.date,
      shop: fields.shop || null,
      shopId: fields.shopId,
      what: fields.what,
      category: fields.category,
      mileage: Number(fields.mileage) || vehicle.mileage,
      cost: Number(fields.cost) || 0,
      notes: fields.notes,
      via: 'manual',
    });
    setServiceDraft(null);
    go('add-service-saved', id);
  };

  const formatDate = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  type RowOpts = { kind?: 'date' | 'number' | 'multiline' | 'text'; placeholder?: string; missingHint?: string };

  const renderRow = (key: keyof ServiceDraftFields, label: string, valueDisplay: string, opts: RowOpts = {}) => {
    const isMissing = missing.includes(String(key));
    const isEditing = editing === key;
    const val = (fields[key] as string | number) ?? '';
    return (
      <div className={'dv-confirm-row ' + (isEditing ? 'editing' : '')} onClick={() => !isEditing && setEditing(key)}>
        <div className="dv-confirm-row__label">{label}</div>
        <div className="dv-confirm-row__value">
          {isEditing ? (
            opts.kind === 'date' ? (
              <input type="date" className="dv-confirm-row__input" value={String(val)} autoFocus
                onChange={e => setField(key, e.target.value as never)}
                onBlur={() => setEditing(null)}/>
            ) : opts.kind === 'number' ? (
              <input type="number" className="dv-confirm-row__input" value={String(val)} autoFocus
                onChange={e => setField(key, Number(e.target.value) as never)}
                onBlur={() => setEditing(null)}/>
            ) : opts.kind === 'multiline' ? (
              <textarea className="dv-confirm-row__input" value={String(val)} autoFocus rows={3}
                onChange={e => setField(key, e.target.value as never)}
                onBlur={() => setEditing(null)}
                style={{ minHeight: 64, resize: 'vertical' }}/>
            ) : (
              <input type="text" className="dv-confirm-row__input" value={String(val)} autoFocus
                onChange={e => setField(key, e.target.value as never)}
                onBlur={() => setEditing(null)}
                placeholder={opts.placeholder}/>
            )
          ) : isMissing && !val ? (
            <>
              <span className="dv-confirm-row__empty">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Tap to add
              </span>
              {opts.missingHint && <span className="dv-confirm-row__hint">{opts.missingHint}</span>}
            </>
          ) : (
            <span>{valueDisplay || <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'italic' }}>{opts.placeholder ?? 'Tap to add'}</span>}</span>
          )}
        </div>
        {!isEditing && (
          <div className="dv-confirm-row__edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z"/>
            </svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title="Confirm details" onBack={() => go('add-service')}/>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="dv-confirm-intro">
          <span className="dv-confirm-intro__lbl">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/></svg>
            From your {sourceLabel(serviceDraft.mode)}
          </span>
          <h2 className="dv-confirm-intro__ttl">
            {isLow
              ? "Here's what I could pull — fill in what I missed."
              : "Here's what I found. Tap anything to fix it."}
          </h2>
          <p className="dv-confirm-intro__msg">
            Saving to <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>'s timeline.
          </p>

          {(serviceDraft.mode === 'photo' || serviceDraft.mode === 'gallery') && (
            <div className="dv-receipt-thumb">
              <div className="dv-receipt-thumb__img"/>
              <div className="dv-receipt-thumb__meta">
                <div className="dv-receipt-thumb__name">receipt_{serviceDraft.mode === 'photo' ? 'photo' : 'upload'}_{new Date().toISOString().slice(0,10)}.jpg</div>
                <div className="dv-receipt-thumb__sub">Attached to this entry</div>
              </div>
              <span className="dv-receipt-thumb__view">View</span>
            </div>
          )}

          {serviceDraft.mode === 'voice' && (
            <div className="dv-receipt-thumb">
              <div className="dv-receipt-thumb__img" style={{ background: 'var(--color-brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                </svg>
              </div>
              <div className="dv-receipt-thumb__meta">
                <div className="dv-receipt-thumb__name">Voice note · 0:12</div>
                <div className="dv-receipt-thumb__sub">"Got my oil and rotation done at Egban this morning…"</div>
              </div>
              <span className="dv-receipt-thumb__view">Play</span>
            </div>
          )}
        </div>

        {isLow && (
          <div className="dv-low-conf-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <div>
              <strong>I'm not sure about the date and shop.</strong> Take a look at the fields marked below — the rest looks right.
            </div>
          </div>
        )}

        <div style={{ padding: '14px 0' }}>
          <div className="dv-confirm-list">
            {renderRow('date', 'Date', formatDate(fields.date), { kind: 'date', missingHint: "I couldn't read the date on your receipt." })}
            {renderRow('shop', 'Shop', fields.shop, { placeholder: 'e.g. Egban Autos', missingHint: 'The shop name was cut off or unclear.' })}
            {renderRow('what', 'Service', fields.what, { placeholder: 'e.g. Oil change' })}
            {renderRow('mileage', 'Mileage', fields.mileage ? `${Number(fields.mileage).toLocaleString()} km` : '', { kind: 'number', placeholder: vehicle.mileage.toLocaleString() })}
            {renderRow('cost', 'Total', fields.cost ? `$${Number(fields.cost).toFixed(2)}` : '', { kind: 'number', placeholder: '0.00' })}
          </div>

          {fields.lineItems.length > 0 && (
            <div style={{ margin: '10px 16px 0' }}>
              <div onClick={() => setLineOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', cursor: 'pointer', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: lineOpen ? '12px 12px 0 0' : 12, fontSize: 13, fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: lineOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .15s' }}>
                  <path d="m9 18 6-6-6-6"/>
                </svg>
                Line items <span style={{ marginLeft: 6, color: 'var(--fg-tertiary)', fontWeight: 500 }}>· {fields.lineItems.length} extracted</span>
              </div>
              <div className={'dv-line-items' + (lineOpen ? ' open' : '')} style={lineOpen ? { borderRadius: '0 0 12px 12px', border: '1px solid var(--border-subtle)', borderTop: 'none' } : {}}>
                {fields.lineItems.map((l, i) => (
                  <div key={i} className="dv-line-items__row">
                    <span className="label">{l.label}</span>
                    <span className="val">${l.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ margin: '10px 16px 0' }}>
            <div className="dv-confirm-list">
              {renderRow('notes', 'Notes', fields.notes, { kind: 'multiline', placeholder: 'Anything else to remember about this visit?' })}
            </div>
          </div>
        </div>
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => { setServiceDraft(null); go('service-log'); }}>Cancel</button>
        <button className="dv-btn dv-btn--primary" style={{ flex: 1.4 }} onClick={handleSave}>
          Save to timeline
        </button>
      </div>
    </div>
  );
}

// ═══════════ ADD SERVICE — MANUAL FALLBACK ════════════════════════
export function AddServiceManualScreen({ go }: { go: GoFn }) {
  const { serviceDraft, setServiceDraft, addServiceEntry, vehicle, shops } = useStore();
  const failed = serviceDraft?.failed;

  const [fields, setFields] = useState({
    date: serviceDraft?.fields?.date || new Date().toISOString().slice(0, 10),
    shop: serviceDraft?.fields?.shop || '',
    shopId: serviceDraft?.fields?.shopId || null as string | null,
    what: serviceDraft?.fields?.what || '',
    category: serviceDraft?.fields?.category || 'other',
    mileage: serviceDraft?.fields?.mileage || vehicle?.mileage || 0,
    cost: serviceDraft?.fields?.cost ? String(serviceDraft.fields.cost) : '',
    notes: serviceDraft?.fields?.notes || '',
  });

  const set = <K extends keyof typeof fields>(k: K, v: (typeof fields)[K]) =>
    setFields(f => ({ ...f, [k]: v }));

  if (!vehicle) return null;

  const handleSave = () => {
    const id = addServiceEntry({
      date: fields.date,
      shop: fields.shop || null,
      shopId: fields.shopId,
      what: fields.what,
      category: fields.category,
      mileage: Number(fields.mileage) || vehicle.mileage,
      cost: Number(fields.cost) || 0,
      notes: fields.notes,
      via: 'manual',
    });
    setServiceDraft(null);
    go('add-service-saved', id);
  };

  const CATEGORIES = [
    { id: 'oil',    label: 'Oil change' },
    { id: 'brake',  label: 'Brakes' },
    { id: 'tire',   label: 'Tires' },
    { id: 'ac',     label: 'AC' },
    { id: 'insp',   label: 'Inspection' },
    { id: 'detail', label: 'Detailing' },
    { id: 'other',  label: 'Other' },
  ];

  return (
    <div className="dv-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <DetailHead title={failed ? 'Add manually' : 'Enter manually'} onBack={() => go('add-service')}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {failed && (
          <div className="dv-fail-banner">
            <strong>I couldn't read that one.</strong> The image may have been too blurry, or there wasn't enough info to extract. No problem — fill in what you remember and I'll save it.
          </div>
        )}

        <div className="dv-vincard" style={{ marginBottom: 14 }}>
          <div className="dv-field">
            <label>Service</label>
            <input type="text" value={fields.what} onChange={e => set('what', e.target.value)} placeholder="e.g. Oil change + filter"/>
          </div>
          <div className="dv-field">
            <label>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORIES.map(c => (
                <div key={c.id} className={'dv-chip ' + (fields.category === c.id ? 'on' : '')} onClick={() => set('category', c.id)}>
                  {c.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="dv-field">
              <label>Date</label>
              <input type="date" value={fields.date} onChange={e => set('date', e.target.value)}/>
            </div>
            <div className="dv-field">
              <label>Mileage</label>
              <input type="number" value={fields.mileage} onChange={e => set('mileage', Number(e.target.value))}/>
            </div>
          </div>
          <div className="dv-field">
            <label>Shop <span style={{ color: 'var(--fg-tertiary)', fontWeight: 400 }}>(optional)</span></label>
            <input type="text" value={fields.shop}
              onChange={e => { set('shop', e.target.value); set('shopId', null); }}
              placeholder="e.g. Egban Autos · leave blank if DIY"
              list="dv-shop-options"/>
            <datalist id="dv-shop-options">
              {shops.map(s => <option key={s.id} value={s.name}/>)}
            </datalist>
          </div>
          <div className="dv-field">
            <label>Total cost</label>
            <input type="number" value={fields.cost} onChange={e => set('cost', e.target.value)} placeholder="0.00"/>
          </div>
          <div className="dv-field">
            <label>Notes <span style={{ color: 'var(--fg-tertiary)', fontWeight: 400 }}>(optional)</span></label>
            <textarea value={fields.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Parts used, anything you'll want to remember…"
              style={{ width: '100%', padding: '13px 14px', fontSize: 14, border: '1px solid var(--border-default)', borderRadius: 10, outline: 'none', fontFamily: 'var(--font-sans)', resize: 'vertical' }}/>
          </div>
        </div>

        {!failed && (
          <div style={{ textAlign: 'center', padding: '6px 16px 0', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>
            Want to try the AI extractor? <a onClick={() => go('add-service')} style={{ color: 'var(--color-brand-600)', fontWeight: 600, cursor: 'pointer' }}>Use a receipt or voice note</a>
          </div>
        )}
      </div>

      <div className="dv-actbar">
        <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => { setServiceDraft(null); go('service-log'); }}>Cancel</button>
        <button className="dv-btn dv-btn--primary" style={{ flex: 1.4 }}
                disabled={!fields.what || !fields.date}
                onClick={handleSave}>
          Save to timeline
        </button>
      </div>
    </div>
  );
}

// ═══════════ ADD SERVICE — SAVED ══════════════════════════════════
export function AddServiceSavedScreen({ go, entryId }: { go: GoFn; entryId?: string }) {
  const { serviceLog, vehicle } = useStore();
  const entry = serviceLog.find(e => e.id === entryId) ?? serviceLog[0];

  if (!entry || !vehicle) {
    return (
      <div className="dv-screen">
        <div className="dv-empty"><h3>Entry not found</h3></div>
      </div>
    );
  }

  return (
    <div className="dv-screen">
      <div className="dv-confirm">
        <div className="badge" style={{ background: 'var(--color-success-500)', boxShadow: '0 8px 24px rgba(16,164,99,.35)' }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2>Saved to timeline</h2>
        <p>Added to your {vehicle.year} {vehicle.make} {vehicle.model}'s service history.</p>

        <div className="dv-saved-row-card">
          <div className="top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12" fill="none" stroke="#fff" strokeWidth="3"/></svg>
            <div className="ttl">{entry.what}</div>
          </div>
          <div className="meta">{entry.shop ?? 'Self-logged'} · {entry.date}</div>
          <div className="stat-row">
            <div className="stat">
              <div className="v">${entry.cost ?? 0}</div>
              <div className="l">Cost</div>
            </div>
            <div className="stat">
              <div className="v">{entry.mileage ? entry.mileage.toLocaleString() : '—'}</div>
              <div className="l">Mileage</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320, marginTop: 24 }}>
          <button className="dv-btn dv-btn--secondary" style={{ flex: 1 }} onClick={() => go('home')}>Done</button>
          <button className="dv-btn dv-btn--primary" style={{ flex: 1.4 }} onClick={() => go('service-log')}>View timeline</button>
        </div>
      </div>
    </div>
  );
}

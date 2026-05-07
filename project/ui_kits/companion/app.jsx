/* global React, IOSDevice */
const { useState } = React;

function Avatar({ initials, color = 'var(--color-brand-500)', size = 36 }) {
  return <div style={{width:size, height:size, borderRadius:'50%', background:color, color:'#fff', fontSize: size * 0.35, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center'}}>{initials}</div>;
}

function HomeScreen({ go }) {
  const actions = [
    { icon: '../../assets/icons/extra/scan.svg', lbl:'Book service' },
    { icon: '../../assets/icons/revv/check-done-01.svg', lbl:'Schedule' },
    { icon: '../../assets/icons/extra/users-01.svg', lbl:'My shop' },
    { icon: '../../assets/icons/revv/info-circle.svg', lbl:'Records' },
  ];
  const upcoming = [
    { ttl:'Annual service inspection', meta:'Egban Autos · Tomorrow, 10:00am', pill:'Confirmed', pillBg:'var(--color-success-50)', pillFg:'var(--color-success-700)', badgeBg:'var(--color-brand-50)', icon:'../../assets/icons/revv/check-done-01.svg', price:'₦24,000' },
    { ttl:'Front brake pads', meta:'Awaiting authorization', pill:'Action needed', pillBg:'var(--color-warning-50)', pillFg:'var(--color-warning-700)', badgeBg:'var(--color-warning-50)', icon:'../../assets/icons/revv/help-circle.svg', price:'₦18,500' },
  ];
  return (
    <div className="cm-screen" style={{paddingBottom:90}}>
      <div className="cm-tbar">
        <Avatar initials="CM"/>
        <div className="greet">
          <div className="lbl">GOOD MORNING</div>
          <div className="name">Chiamaka</div>
        </div>
        <div className="bell">
          <img src="../../assets/icons/extra/lightbulb-02.svg" style={{width:18, height:18, opacity:.7}}/>
          <span className="dot"/>
        </div>
      </div>

      <div className="cm-hero" onClick={()=>go('detail')}>
        <div className="lbl">YOUR VEHICLE</div>
        <div className="nm">2018 Toyota Corolla</div>
        <span className="plate">LAG-457-XK</span>
        <div className="stats">
          <div className="stat"><div className="v">42,180 km</div><div className="l">Mileage</div></div>
          <div className="stat"><div className="v">Mar 12</div><div className="l">Last service</div></div>
          <div className="stat"><div className="v">2 open</div><div className="l">Work orders</div></div>
        </div>
      </div>

      <div className="cm-section">
        <div className="cm-actions">
          {actions.map(a => (
            <div key={a.lbl} className="cm-action">
              <div className="ic"><img src={a.icon}/></div>
              <div className="lbl">{a.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cm-section">
        <h4>Upcoming<span className="more">See all</span></h4>
        {upcoming.map(s => (
          <div key={s.ttl} className="cm-svc" onClick={()=>go('detail')}>
            <div className="badge" style={{background: s.badgeBg}}>
              <img src={s.icon} style={{width:18, height:18, opacity:.85}}/>
            </div>
            <div style={{flex:1}}>
              <div className="ttl">{s.ttl}</div>
              <div className="meta">{s.meta}</div>
              <span className="pill" style={{background: s.pillBg, color: s.pillFg}}>{s.pill}</span>
            </div>
            <div className="price">{s.price}</div>
          </div>
        ))}
      </div>

      <div className="cm-section">
        <h4>Recent activity</h4>
        <div className="cm-svc">
          <div className="badge" style={{background: 'var(--color-success-50)'}}>
            <img src="../../assets/icons/revv/check-circle.svg" style={{width:18, height:18}}/>
          </div>
          <div style={{flex:1}}>
            <div className="ttl">Oil change · paid</div>
            <div className="meta">8th June 2022 · ₦8,500.00</div>
          </div>
          <img src="../../assets/icons/revv/Chevron-Right.svg" style={{width:14, height:14, opacity:.5, alignSelf:'center'}}/>
        </div>
      </div>

      <BottomNav active="home" go={go}/>
    </div>
  );
}

function BottomNav({ active, go }) {
  return (
    <div className="cm-bnav">
      <div className={'nav ' + (active==='home'?'on':'')} onClick={()=>go('home')}>
        <img src="../../assets/icons/revv/home-line.svg"/><span className="lb">Home</span>
      </div>
      <div className={'nav ' + (active==='services'?'on':'')} onClick={()=>go('home')}>
        <img src="../../assets/icons/revv/BriefcaseCheck.svg"/><span className="lb">Services</span>
      </div>
      <div className="fab">+</div>
      <div className={'nav ' + (active==='records'?'on':'')}>
        <img src="../../assets/icons/revv/check-done-01.svg"/><span className="lb">Records</span>
      </div>
      <div className={'nav ' + (active==='profile'?'on':'')}>
        <img src="../../assets/icons/extra/user-circle.svg"/><span className="lb">Profile</span>
      </div>
    </div>
  );
}

function DetailScreen({ go }) {
  return (
    <div className="cm-screen" style={{background:'#fff', paddingBottom:90}}>
      <div className="cm-detail-head">
        <div className="back" onClick={()=>go('home')}>
          <img src="../../assets/icons/revv/Chevron-Right.svg" style={{width:14, height:14, transform:'rotate(180deg)', opacity:.7}}/>
        </div>
        <h3>Work order #0065</h3>
        <span style={{marginLeft:'auto', fontSize:11, padding:'3px 9px', borderRadius:5, background:'var(--color-warning-50)', color:'var(--color-warning-700)', fontWeight:500}}>Awaiting authorization</span>
      </div>
      <div style={{padding:'18px 16px'}}>
        <div style={{fontSize:11, color:'var(--fg-tertiary)', textTransform:'uppercase', letterSpacing:'.06em', fontWeight:600}}>SERVICES</div>
        <div style={{fontSize:18, fontWeight:600, marginTop:4, lineHeight:1.35}}>ECU Diagnostics, Oil filter change, HVAC blend door actuator <span style={{color:'var(--fg-tertiary)', fontWeight:400}}>+3 more</span></div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginTop:14, padding:'12px 14px', background:'var(--color-neutral-50)', borderRadius:10}}>
          <span style={{opacity:.6}}>🚗</span>
          <span style={{fontSize:13, fontWeight:500}}>2018 Toyota Corolla · LAG-457-XK</span>
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginTop:14, padding:'12px 0', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)'}}>
          <span style={{fontSize:13, color:'var(--fg-secondary)'}}>Estimate</span>
          <span style={{fontSize:18, fontWeight:600}}>₦32,000.00</span>
        </div>
      </div>

      <div className="cm-section">
        <h4>Timeline</h4>
        <div className="cm-timeline">
          <div className="cm-tl-item">
            <div className="col"><div className="dot" style={{background:'var(--color-brand-500)'}}/><div className="ln"/></div>
            <div className="body">
              <div className="when">12 JUN · 9:42 AM</div>
              <div className="ttl">Estimate ready</div>
              <div className="desc">Daniel sent your estimate. Approve to start work.</div>
            </div>
          </div>
          <div className="cm-tl-item">
            <div className="col"><div className="dot" style={{background:'var(--color-success-500)'}}/><div className="ln"/></div>
            <div className="body">
              <div className="when">12 JUN · 8:15 AM</div>
              <div className="ttl">Vehicle dropped off</div>
              <div className="desc">Egban Autos, Lagos branch.</div>
            </div>
          </div>
          <div className="cm-tl-item">
            <div className="col"><div className="dot" style={{background:'var(--color-neutral-300)'}}/></div>
            <div className="body">
              <div className="when">11 JUN</div>
              <div className="ttl">Appointment booked</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{padding:'16px', display:'flex', gap:10, marginTop:8, borderTop:'1px solid var(--border-subtle)', background:'#fff'}}>
        <button style={{flex:1, padding:'14px', borderRadius:10, border:'1px solid var(--border-default)', background:'#fff', fontSize:14, fontWeight:600, color:'var(--fg-primary)'}}>Decline</button>
        <button style={{flex:2, padding:'14px', borderRadius:10, border:'none', background:'var(--color-brand-500)', color:'#fff', fontSize:14, fontWeight:600}}>Approve estimate</button>
      </div>
      <BottomNav active="services" go={go}/>
    </div>
  );
}

function AuthScreen({ go }) {
  return (
    <div className="cm-screen" style={{background:'#fff'}}>
      <div className="cm-auth">
        <div className="logo">
          <img src="../../assets/brand/logo-revv.svg" style={{height:30}}/>
        </div>
        <h2>Welcome back</h2>
        <p>Sign in to track your vehicle's care.</p>
        <div className="field"><label>Email</label><input placeholder="you@email.com"/></div>
        <div className="field"><label>Password</label><input type="password" placeholder="••••••••"/></div>
        <div style={{textAlign:'right', fontSize:12, color:'var(--color-brand-600)', fontWeight:500, marginBottom:14}}>Forgot password?</div>
        <button className="primary" onClick={()=>go('home')}>Sign in</button>
        <div style={{display:'flex', alignItems:'center', gap:12, margin:'24px 0 16px'}}>
          <div style={{flex:1, height:1, background:'var(--border-subtle)'}}/>
          <span style={{fontSize:11, color:'var(--fg-tertiary)', textTransform:'uppercase', letterSpacing:'.08em'}}>OR</span>
          <div style={{flex:1, height:1, background:'var(--border-subtle)'}}/>
        </div>
        <button style={{padding:'13px', background:'#fff', border:'1px solid var(--border-default)', borderRadius:8, fontSize:14, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
          <img src="../../assets/icons/extra/phone-01.svg" style={{width:16, height:16}}/>Continue with phone
        </button>
        <div className="alt">New here? <a>Create account</a></div>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('home');
  return (
    <div style={{display:'flex', gap:48, padding:'40px 24px', justifyContent:'center', minHeight:'100vh', background:'var(--color-neutral-100)', alignItems:'flex-start', flexWrap:'wrap'}}>
      <div>
        <div style={{textAlign:'center', marginBottom:14, fontSize:12, fontWeight:600, color:'var(--fg-tertiary)', textTransform:'uppercase', letterSpacing:'.08em'}}>Sign In</div>
        <IOSDevice><AuthScreen go={()=>{}}/></IOSDevice>
      </div>
      <div>
        <div style={{textAlign:'center', marginBottom:14, fontSize:12, fontWeight:600, color:'var(--fg-tertiary)', textTransform:'uppercase', letterSpacing:'.08em'}}>Home</div>
        <IOSDevice><HomeScreen go={setScreen}/></IOSDevice>
      </div>
      <div>
        <div style={{textAlign:'center', marginBottom:14, fontSize:12, fontWeight:600, color:'var(--fg-tertiary)', textTransform:'uppercase', letterSpacing:'.08em'}}>Work order detail</div>
        <IOSDevice><DetailScreen go={()=>{}}/></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

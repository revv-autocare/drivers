/* global React */

function Workbay({ orders, addOrder }) {
  const cols = [
    { id:'estimate',    label:'ESTIMATE',    accent:'var(--color-brand-500)' },
    { id:'in-shop',     label:'IN SHOP',     accent:'var(--color-neutral-400)' },
    { id:'in-progress', label:'IN PROGRESS', accent:'var(--color-warning-400)' },
    { id:'completed',   label:'COMPLETED',   accent:'var(--color-success-500)' },
  ];

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:18}}>
        <button className="rv-btn rv-btn--primary" onClick={()=>addOrder('estimate')}>
          <span style={{fontSize:16, lineHeight:'14px'}}>+</span>New work order
        </button>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:18, marginBottom:20}}>
        <div className="rv-search">
          <img src="../../assets/icons/revv/help-circle.svg" alt=""/>
          <input placeholder="Search workbay"/>
        </div>
        <button className="rv-filter">STATUS <img src="../../assets/icons/revv/Chevron-Down.svg"/></button>
        <button className="rv-filter">APPOINTMENT TYPE <img src="../../assets/icons/revv/Chevron-Down.svg"/></button>
        <button className="rv-filter">TECHNICIAN <img src="../../assets/icons/revv/Chevron-Down.svg"/></button>
      </div>
      <div className="rv-board">
        {cols.map(col => {
          const items = orders.filter(o => o.status === col.id);
          return (
            <div key={col.id} className="rv-column">
              <div className={'rv-col-head ' + col.id}>
                <span className="label" style={{color: col.accent}}>{col.label}</span>
                <span className="count">{items.length}</span>
              </div>
              {items.map(o => <WorkOrderCard key={o.id} order={o} accent={col.accent}/>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Customers() {
  const rows = [
    { name:'James Adejuwon',   email:'james@email.com',     phone:'0803 345 5778', vehicles:2 },
    { name:'Chiamaka Mbamalu', email:'chiamaka@email.com',  phone:'0803 345 5778', vehicles:1 },
    { name:'Jonathan Little',  email:'jonathan@email.com',  phone:'0803 345 5778', vehicles:3 },
    { name:'Bukunmi Adedeji',  email:'bukunmi@email.com',   phone:'0803 345 5778', vehicles:1 },
    { name:'Patrick Lewon',    email:'patrick@email.com',   phone:'0803 345 5778', vehicles:2 },
    { name:'Tinibu Daniels',   email:'tinibu@email.com',    phone:'0803 345 5778', vehicles:1 },
  ];
  const initials = (n) => n.split(' ').map(s=>s[0]).join('').slice(0,2);
  return (
    <div>
      <div style={{display:'flex', alignItems:'center', marginBottom:18}}>
        <div className="rv-search" style={{maxWidth:360}}>
          <img src="../../assets/icons/revv/help-circle.svg" alt=""/>
          <input placeholder="Search customers"/>
        </div>
        <button className="rv-btn rv-btn--primary" style={{marginLeft:'auto'}}>+ Add customer</button>
      </div>
      <table className="rv-table">
        <thead><tr><th>NAME</th><th>EMAIL</th><th>PHONE</th><th>VEHICLES</th><th></th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name}>
              <td><span className="av">{initials(r.name)}</span>{r.name}</td>
              <td className="em">{r.email}</td>
              <td>{r.phone}</td>
              <td>{r.vehicles}</td>
              <td style={{textAlign:'right', color:'var(--fg-tertiary)'}}>⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Settings({ setToast }) {
  const [upcoming, setUpcoming] = useState(true);
  const [outstanding, setOutstanding] = useState(true);
  const tabs = ['Auto shop', 'Vehicles', 'Labour and rates', 'Payment and taxes'];
  const [tab, setTab] = useState(3);
  return (
    <div style={{display:'flex', gap:32, maxWidth:1100}}>
      <div style={{width:200, display:'flex', flexDirection:'column', gap:4}}>
        {['General','Users','Branches','Billing','Integrations','Roles & Permissions'].map((s,i) => (
          <div key={s} style={{padding:'10px 12px', borderRadius:6, fontSize:14, fontWeight: i===0?600:500, color: i===0?'var(--color-brand-600)':'var(--fg-secondary)', background: i===0?'var(--color-brand-50)':'transparent', cursor:'pointer'}}>{s}</div>
        ))}
      </div>
      <div style={{flex:1}}>
        <h3 style={{marginBottom:6}}>General</h3>
        <p style={{color:'var(--fg-secondary)', fontSize:14, marginBottom:18}}>Manage your organization settings.</p>
        <div className="rv-tabs">
          {tabs.map((t, i) => (
            <div key={t} className={'tab' + (i===tab?' active':'')} onClick={()=>setTab(i)}>{t.toUpperCase()}</div>
          ))}
        </div>
        <h5 style={{marginBottom:4}}>Payment information</h5>
        <p style={{color:'var(--fg-secondary)', fontSize:14, marginBottom:14}}>Set up your bank account to receive payment.</p>
        <div style={{background:'#fff', border:'1px solid var(--border-subtle)', borderRadius:10, padding:'14px 18px', marginBottom:14, display:'flex', alignItems:'center', gap:14}}>
          <div style={{width:36, height:36, borderRadius:8, background:'var(--color-brand-50)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <img src="../../assets/icons/revv/building-08.svg" style={{width:18, height:18, opacity:.8}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14, fontWeight:500}}>Access Bank · account ending – 0589</div>
          </div>
          <button className="rv-btn rv-btn--ghost" style={{padding:'6px 12px', fontSize:13}}>Edit</button>
        </div>
        <button className="rv-btn rv-btn--secondary" style={{marginBottom:24}}>+ Add method</button>

        <h5 style={{marginBottom:4}}>Payment reminders</h5>
        <p style={{color:'var(--fg-secondary)', fontSize:14, marginBottom:14}}>Schedule payment reminders for your customers.</p>
        <div style={{background:'#fff', border:'1px solid var(--border-subtle)', borderRadius:10, overflow:'hidden'}}>
          <div style={{display:'flex', alignItems:'center', padding:'14px 18px', borderBottom:'1px solid var(--border-subtle)'}}>
            <div>
              <div style={{fontSize:14, fontWeight:500}}>Upcoming payment</div>
              <div style={{fontSize:13, color:'var(--fg-secondary)', marginTop:2}}>Reminder sent 12 days before payment due date</div>
            </div>
            <div style={{marginLeft:'auto'}} className={'rv-toggle'} onClick={()=>{ setUpcoming(!upcoming); setToast(upcoming ? 'Reminder turned off' : 'Reminder turned on'); }}>
              <div style={{width:44, height:24, background: upcoming ? 'var(--color-success-500)' : 'var(--color-grey-200)', borderRadius:999, position:'relative', transition:'background .15s ease', cursor:'pointer'}}>
                <div style={{position:'absolute', top:2, left: upcoming ? 22 : 2, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 2px rgba(16,24,40,.2)', transition:'left .15s ease'}}/>
              </div>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', padding:'14px 18px'}}>
            <div>
              <div style={{fontSize:14, fontWeight:500}}>Outstanding payment</div>
              <div style={{fontSize:13, color:'var(--fg-secondary)', marginTop:2}}>Reminder sent 2 days after payment due date (if payment hasn't been made)</div>
            </div>
            <div style={{marginLeft:'auto'}} onClick={()=>{ setOutstanding(!outstanding); setToast(outstanding ? 'Reminder turned off' : 'Payment reminder added successfully'); }}>
              <div style={{width:44, height:24, background: outstanding ? 'var(--color-success-500)' : 'var(--color-grey-200)', borderRadius:999, position:'relative', cursor:'pointer'}}>
                <div style={{position:'absolute', top:2, left: outstanding ? 22 : 2, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 2px rgba(16,24,40,.2)'}}/>
              </div>
            </div>
          </div>
          <div style={{padding:'14px 18px', borderTop:'1px solid var(--border-subtle)'}}>
            <button className="rv-btn rv-btn--secondary" onClick={()=>setToast('Payment reminder added successfully')}>+ Add reminder</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const stats = [
    { label:'Open work orders', value:'18', delta:'+3 this week', color:'var(--color-brand-500)' },
    { label:'Revenue this month', value:'₦1.42M', delta:'+12% vs last month', color:'var(--color-success-500)' },
    { label:'Avg. ticket', value:'₦27,400', delta:'-4% vs last month', color:'var(--color-warning-500)' },
    { label:'Customers', value:'264', delta:'+8 new', color:'var(--color-neutral-400)' },
  ];
  return (
    <div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:24}}>
        {stats.map(s => (
          <div key={s.label} style={{background:'#fff', border:'1px solid var(--border-subtle)', borderRadius:10, padding:18, boxShadow:'var(--shadow-sm)'}}>
            <div style={{fontSize:12, fontWeight:600, color:'var(--fg-tertiary)', textTransform:'uppercase', letterSpacing:'.06em'}}>{s.label}</div>
            <div style={{fontSize:30, fontWeight:700, marginTop:8, letterSpacing:'-0.02em'}}>{s.value}</div>
            <div style={{fontSize:12, color: s.color, marginTop:4}}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff', border:'1px solid var(--border-subtle)', borderRadius:10, padding:24, boxShadow:'var(--shadow-sm)'}}>
        <h5 style={{marginBottom:14}}>Recent activity</h5>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {[
            ['#0065 created', 'Daniel Tobiloba · 5 min ago', 'var(--color-brand-500)'],
            ['#0058 marked as in progress', 'Yetunde P · 24 min ago', 'var(--color-warning-500)'],
            ['#0055 paid ₦24,000.00', 'Ada S · 1 hr ago', 'var(--color-success-500)'],
            ['Customer James Adejuwon added', 'Mark K · 3 hrs ago', 'var(--color-neutral-400)'],
          ].map(([t, m, c], i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i<3 ? '1px solid var(--border-subtle)' : 'none'}}>
              <div style={{width:8, height:8, borderRadius:'50%', background:c}}/>
              <div style={{flex:1, fontSize:14}}>{t}</div>
              <div style={{fontSize:12, color:'var(--fg-secondary)'}}>{m}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* global React */
const { useState } = React;

function Sidebar({ view, setView }) {
  const items = [
    { id:'dashboard', label:'Dashboard', icon:'home-line.svg' },
    { id:'workbay',   label:'Workbay',   icon:'BriefcaseCheck.svg' },
    { id:'customers', label:'Customers', icon:'users-01.svg', extra:'extra' },
    { id:'calendar',  label:'Calendar',  icon:'check-done-01.svg' },
    { id:'report',    label:'Report',    icon:'link-01.svg' },
    { id:'settings',  label:'Settings',  icon:'help-circle.svg' },
  ];
  return (
    <div className="rv-sidebar">
      <div className="logo"><img src="../../assets/brand/logo-revv-white.svg" alt="revv" style={{height:24}}/></div>
      {items.map(it => (
        <div key={it.id} className={'nav-item' + (view===it.id ? ' active' : '')} onClick={()=>setView(it.id)}>
          <img src={'../../assets/icons/' + (it.extra ? 'extra/' : 'revv/') + it.icon} alt=""/>
          <span>{it.label}</span>
          {view===it.id && <span style={{marginLeft:'auto', width:6, height:6, background:'var(--color-brand-500)', borderRadius:'50%'}}/>}
        </div>
      ))}
      <div className="spacer"/>
      <div className="branch">Egban Autos<br/><span style={{opacity:.7, fontSize:11}}>Lagos branch</span></div>
    </div>
  );
}

function Topbar({ title }) {
  return (
    <div className="rv-topbar">
      <div className="pagetitle">{title}</div>
      <div className="right">
        <div className="bell" title="Notifications">
          <img src="../../assets/icons/extra/wifi.svg" alt="" style={{width:18, height:18, opacity:.7, transform:'rotate(0)'}}/>
        </div>
        <div className="user">
          <span>Daniel Tobiloba</span>
          <div className="av">DT</div>
          <img src="../../assets/icons/revv/Chevron-Down.svg" alt="" style={{width:14, height:14, opacity:.6}}/>
        </div>
      </div>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="rv-toast">
      <img src="../../assets/icons/revv/check-circle.svg" alt="" className="check"/>
      <span>{message}</span>
    </div>
  );
}

function WorkOrderCard({ order, accent }) {
  return (
    <div className="rv-card">
      <div className="accent" style={{background: accent}}/>
      <div className="body">
        <div className="head">
          <div className="id">{order.id} - {order.services}{order.extra ? <span className="more"> +{order.extra} more</span> : null}</div>
          <span className="menu">⋮</span>
        </div>
        <div className="meta">
          <span style={{opacity:.6}}>🚗</span>{order.vehicle}
        </div>
        <div className="avs">
          {order.assignees.map((a, i) => {
            const colors = ['var(--color-brand-500)', 'var(--color-error-500)', 'var(--color-warning-500)', 'var(--color-success-500)'];
            return <div key={i} className="av" style={{background: colors[i%4]}}>{a}</div>;
          })}
          <div className="av plus">+</div>
        </div>
        <div className="row2">
          <span className="date">📅 {order.date}</span>
          <span className={'price' + (order.paid ? ' paid' : '')}>{order.price}{order.paid ? ' ✓' : ''}</span>
        </div>
        <div className="pills">
          {order.pills.map((p, i) => {
            const cls = p.toLowerCase().includes('paid') ? 'rv-pill--success'
                      : p.toLowerCase().includes('declined') ? 'rv-pill--error'
                      : p.toLowerCase().includes('requires') ? 'rv-pill--warning'
                      : 'rv-pill--gray';
            return <span key={i} className={'rv-pill ' + cls}>{p}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

window.SEED_ORDERS = [
  // Estimate (blue)
  { id:'#0065', status:'estimate', services:'ECU Diagnostics, Oil filter change, HVAC blend door actuator', extra:3, vehicle:'2018 Toyota Corolla', assignees:['RO','YP'], date:'12th June, 2022', price:'₦32,000.00', pills:['Awaiting authorization','No payment recorded'] },
  { id:'#0066', status:'estimate', services:'Coolant flush, Spark plug replacement', extra:1, vehicle:'2017 Nissan Altima', assignees:['MK'], date:'12th June, 2022', price:'₦12,500.00', pills:['Awaiting authorization'] },
  // In shop (grey)
  { id:'#0061', status:'in-shop', services:'Front brake pads, Rotor inspection', extra:0, vehicle:'2020 Honda Civic', assignees:['AS','DT'], date:'12th June, 2022', price:'₦18,500.00', pills:['No payment recorded'] },
  { id:'#0062', status:'in-shop', services:'Suspension check, Wheel alignment', extra:2, vehicle:'2019 Mazda CX-5', assignees:['YP'], date:'12th June, 2022', price:'₦24,000.00', pills:['No payment recorded'] },
  // In progress (amber)
  { id:'#0058', status:'in-progress', services:'Transmission service, ECU update', extra:1, vehicle:'2016 Ford Focus', assignees:['RO'], date:'10th June, 2022', price:'₦45,000.00', pills:['Requires authorization'] },
  { id:'#0059', status:'in-progress', services:'AC compressor replacement', extra:0, vehicle:'2021 Hyundai Tucson', assignees:['DT','AS','RO'], date:'11th June, 2022', price:'₦68,000.00', pills:['Requires authorization'] },
  // Completed (green)
  { id:'#0055', status:'completed', services:'Annual service inspection', extra:0, vehicle:'2019 Mazda CX-5', assignees:['DT'], date:'8th June, 2022', price:'₦24,000.00', paid:true, pills:['Paid'] },
  { id:'#0056', status:'completed', services:'Oil change, Air filter', extra:0, vehicle:'2018 Toyota Corolla', assignees:['MK'], date:'9th June, 2022', price:'₦8,500.00', paid:true, pills:['Paid'] },
];

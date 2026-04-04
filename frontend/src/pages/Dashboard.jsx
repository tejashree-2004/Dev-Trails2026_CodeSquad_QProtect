import { useState, useEffect } from 'react';
import { getDashboard, checkDisruption } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [disruption, setDisruption] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const worker_id = localStorage.getItem('worker_id');
  const zone = localStorage.getItem('worker_zone');
  const name = localStorage.getItem('worker_name');

  const load = async () => {
    const res = await getDashboard(worker_id);
    setData(res.data);
  };

  useEffect(() => { load(); }, []);

  const simulate = async () => {
    setSimulating(true);
    setDisruption(null);
    const res = await checkDisruption(zone);
    setDisruption(res.data);
    await load();
    setSimulating(false);
  };

  if (!data) return <div style={{color:'#fff',textAlign:'center',paddingTop:'40px'}}>Loading...</div>;

  const riskLevel = 'High';

  return (
    <div style={c.page}>
      <div style={c.phone}>
        <div style={c.header}>
          <div>
            <div style={c.logoRow}><span style={c.logo}>Q</span><span style={c.logoW}>Protect</span></div>
            <div style={c.zonePill}><div style={c.dot}></div>{zone} · Active</div>
          </div>
          <div style={c.avatar}>{name?.[0]?.toUpperCase()}</div>
        </div>

        <div style={c.riskCard}>
          <div style={c.riskTop}>
            <div>
              <div style={c.riskLabel}>Today's disruption risk</div>
              <div style={c.riskVal}>{riskLevel}</div>
              <div style={c.riskSub}>Heavy rain forecast · Coverage armed</div>
            </div>
            <div style={c.armedBadge}>ARMED</div>
          </div>
          <div style={c.sigRow}>
            {[['Rain','🌧',true],['Store','🏪',true],['GPS','📍',false]].map(([l,e,on])=>(
              <div key={l} style={c.sig}>
                <div style={{...c.sigDot, background: on ? '#22c55e':'#334155'}}></div>
                <div style={c.sigTxt}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={c.statRow}>
          <div style={c.stat}>
            <div style={c.statV}>₹{data.total_received}</div>
            <div style={c.statL}>Total received</div>
          </div>
          <div style={c.stat}>
            <div style={c.statV}>{data.claims.length}</div>
            <div style={c.statL}>Payouts</div>
          </div>
          <div style={c.stat}>
            <div style={c.statV}>₹{data.policy?.premium ?? '--'}</div>
            <div style={c.statL}>This week</div>
          </div>
        </div>

        <button style={c.simBtn} onClick={simulate} disabled={simulating}>
          {simulating ? '⏳ Detecting signals...' : '⚡ Simulate Disruption'}
        </button>

        {disruption && (
          <div style={{...c.result, borderColor: disruption.is_valid ? '#22c55e':'#dc2626'}}>
            <div style={c.resultTitle}>
              {disruption.is_valid ? '✅ Disruption confirmed — payout triggered!' : '❌ Signals insufficient — no payout'}
            </div>
            <div style={c.sigRow2}>
              {Object.entries(disruption.signals).map(([k,v])=>(
                <div key={k} style={c.sig2}>
                  <div style={{...c.sigDot, background: v?'#22c55e':'#334155', width:'10px',height:'10px'}}></div>
                  <div style={c.sigTxt}>{k.replace('_',' ')}</div>
                </div>
              ))}
            </div>
            <div style={c.severity}>Severity score: {disruption.severity_score}/100</div>
            {disruption.payouts_triggered?.length > 0 && (
              <div style={c.payoutBox}>
                ₹{disruption.payouts_triggered[0].amount} credited to UPI automatically
              </div>
            )}
          </div>
        )}

        {data.claims.length > 0 && (
          <div style={{marginTop:'16px'}}>
            <div style={c.sectionTitle}>Recent payouts</div>
            {data.claims.slice(-3).reverse().map((cl,i)=>(
              <div key={i} style={c.payoutItem}>
                <div>
                  <div style={{fontSize:'13px',fontWeight:'600'}}>Disruption event</div>
                  <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'2px'}}>{cl.status}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'16px',fontWeight:'800',color:'#22c55e'}}>₹{cl.payout_amount}</div>
                  <div style={{fontSize:'10px',background:'#14532d',color:'#22c55e',padding:'2px 8px',borderRadius:'10px',marginTop:'4px'}}>Auto-paid</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const c = {
  page: { minHeight:'100vh', background:'#030712', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  phone: { background:'#0f172a', borderRadius:'32px', padding:'28px 22px', width:'100%', maxWidth:'360px', color:'#fff' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' },
  logoRow: { marginBottom:'4px' },
  logo: { fontSize:'20px', fontWeight:'800', color:'#22c55e' },
  logoW: { fontSize:'20px', fontWeight:'800', color:'#fff' },
  zonePill: { display:'inline-flex', alignItems:'center', gap:'5px', background:'#1e293b', borderRadius:'20px', padding:'4px 10px', fontSize:'11px', color:'#94a3b8' },
  dot: { width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e' },
  avatar: { width:'36px', height:'36px', borderRadius:'50%', background:'#14532d', color:'#22c55e', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'14px' },
  riskCard: { background:'linear-gradient(135deg,#14532d,#166534)', borderRadius:'16px', padding:'16px', marginBottom:'14px' },
  riskTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' },
  riskLabel: { fontSize:'11px', color:'#86efac', marginBottom:'4px' },
  riskVal: { fontSize:'28px', fontWeight:'800', color:'#fff' },
  riskSub: { fontSize:'11px', color:'#86efac' },
  armedBadge: { background:'#dc2626', color:'#fff', fontSize:'10px', padding:'4px 10px', borderRadius:'20px', fontWeight:'700' },
  sigRow: { display:'flex', gap:'8px' },
  sig: { flex:1, background:'rgba(255,255,255,0.1)', borderRadius:'8px', padding:'8px', textAlign:'center' },
  sigDot: { width:'8px', height:'8px', borderRadius:'50%', margin:'0 auto 4px' },
  sigTxt: { fontSize:'9px', color:'#cbd5e1' },
  statRow: { display:'flex', gap:'10px', marginBottom:'14px' },
  stat: { flex:1, background:'#1e293b', borderRadius:'12px', padding:'12px', textAlign:'center' },
  statV: { fontSize:'18px', fontWeight:'800', color:'#22c55e' },
  statL: { fontSize:'9px', color:'#94a3b8', marginTop:'3px' },
  simBtn: { width:'100%', background:'#dc2626', color:'#fff', fontWeight:'800', border:'none', borderRadius:'12px', padding:'14px', fontSize:'13px', cursor:'pointer', marginBottom:'14px' },
  result: { border:'2px solid', borderRadius:'12px', padding:'14px', marginBottom:'14px' },
  resultTitle: { fontSize:'12px', fontWeight:'700', marginBottom:'10px' },
  sigRow2: { display:'flex', gap:'8px', marginBottom:'10px' },
  sig2: { flex:1, background:'#1e293b', borderRadius:'8px', padding:'8px', textAlign:'center' },
  severity: { fontSize:'11px', color:'#94a3b8', textAlign:'center', marginBottom:'8px' },
  payoutBox: { background:'#14532d', borderRadius:'8px', padding:'10px', fontSize:'12px', textAlign:'center', color:'#22c55e', fontWeight:'600' },
  sectionTitle: { fontSize:'11px', color:'#94a3b8', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:'10px' },
  payoutItem: { background:'#1e293b', borderRadius:'10px', padding:'12px 14px', marginBottom:'8px', display:'flex', justifyContent:'space-between', alignItems:'center' },
};
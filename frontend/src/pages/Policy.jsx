import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPremium, activatePolicy } from '../api';

const PLANS = ['Basic','Standard','Premium'];
const MAX = { Basic:200, Standard:400, Premium:600 };

export default function Policy() {
  const [selected, setSelected] = useState('Standard');
  const [premiums, setPremiums] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const zone = localStorage.getItem('worker_zone') || 'Velachery';
  const worker_id = localStorage.getItem('worker_id');

  useEffect(() => {
    PLANS.forEach(async plan => {
      const res = await getPremium({ zone, plan });
      setPremiums(p => ({...p, [plan]: res.data}));
    });
  }, [zone]);

  const activate = async () => {
    setLoading(true);
    await activatePolicy({ worker_id: parseInt(worker_id), plan: selected, zone });
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div style={c.page}>
      <div style={c.phone}>
        <div style={c.logoRow}><span style={c.logo}>Q</span><span style={c.logoW}>Protect</span></div>
        <div style={c.pill}>Choose your plan</div>
        <div style={c.h1}>Weekly coverage</div>
        <div style={c.sub}>AI-calculated premium for {zone}</div>

        {PLANS.map(plan => {
          const d = premiums[plan];
          const active = selected === plan;
          return (
            <div key={plan} style={{...c.planCard, borderColor: active ? '#22c55e':'#1e293b'}}
              onClick={() => setSelected(plan)}>
              <div style={c.planRow}>
                <div>
                  <div style={c.planName}>{plan}
                    {plan==='Standard' && <span style={c.rec}>Recommended</span>}
                  </div>
                  <div style={c.planDetail}>Max payout ₹{MAX[plan]} · Risk {d ? Math.round(d.zone_risk_score*100) : '...'}%</div>
                </div>
                <div style={c.planPrice}>₹{d?.premium ?? '...'}<span style={c.perWk}>/wk</span></div>
              </div>
              {active && <div style={c.checkRow}>
                <div style={c.check}>Rain covered</div>
                <div style={c.check}>Heat covered</div>
                <div style={c.check}>Auto UPI</div>
              </div>}
            </div>
          );
        })}

        <button style={c.btnG} onClick={activate} disabled={loading}>
          {loading ? 'Activating...' : `Activate ${selected} →`}
        </button>
        <div style={c.foot}>Auto-renews weekly · Cancel anytime</div>
      </div>
    </div>
  );
}

const c = {
  page: { minHeight:'100vh', background:'#030712', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  phone: { background:'#0f172a', borderRadius:'32px', padding:'32px 24px', width:'100%', maxWidth:'360px', color:'#fff' },
  logoRow: { marginBottom:'4px' },
  logo: { fontSize:'20px', fontWeight:'800', color:'#22c55e' },
  logoW: { fontSize:'20px', fontWeight:'800', color:'#fff' },
  pill: { display:'inline-block', background:'#14532d', color:'#22c55e', fontSize:'11px', padding:'3px 10px', borderRadius:'20px', marginBottom:'20px' },
  h1: { fontSize:'24px', fontWeight:'800', marginBottom:'4px' },
  sub: { fontSize:'13px', color:'#94a3b8', marginBottom:'20px' },
  planCard: { background:'#1e293b', borderRadius:'14px', padding:'14px', marginBottom:'10px', border:'2px solid', cursor:'pointer' },
  planRow: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  planName: { fontSize:'15px', fontWeight:'700', marginBottom:'4px' },
  planDetail: { fontSize:'11px', color:'#94a3b8' },
  planPrice: { fontSize:'22px', fontWeight:'800', color:'#22c55e' },
  perWk: { fontSize:'11px', color:'#94a3b8', fontWeight:'400' },
  rec: { background:'#14532d', color:'#22c55e', fontSize:'9px', padding:'2px 8px', borderRadius:'10px', marginLeft:'6px', fontWeight:'600' },
  checkRow: { display:'flex', gap:'8px', marginTop:'10px', flexWrap:'wrap' },
  check: { background:'#14532d', color:'#22c55e', fontSize:'10px', padding:'3px 10px', borderRadius:'20px' },
  btnG: { width:'100%', background:'#22c55e', color:'#000', fontWeight:'800', border:'none', borderRadius:'12px', padding:'14px', fontSize:'14px', cursor:'pointer', marginTop:'8px' },
  foot: { textAlign:'center', marginTop:'10px', fontSize:'11px', color:'#475569' },
};
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWorker } from '../api';

const ZONES = ['Velachery','Anna Nagar','Koramangala','Andheri','Saket'];

export default function Register() {
  const [form, setForm] = useState({ name:'', phone:'', zone:'Velachery' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return setError('All fields required');
    setLoading(true);
    try {
      const res = await registerWorker(form);
      localStorage.setItem('worker_id', res.data.worker_id);
      localStorage.setItem('worker_zone', form.zone);
      localStorage.setItem('worker_name', form.name);
      navigate('/policy');
    } catch {
      setError('Registration failed. Phone may already be registered.');
    }
    setLoading(false);
  };

  return (
    <div style={c.page}>
      <div style={c.phone}>
        <div style={c.logoRow}><span style={c.logo}>Q</span><span style={c.logoW}>Protect</span></div>
        <div style={c.pill}>New Account</div>
        <div style={c.h1}>Create account</div>
        <div style={c.sub}>Join thousands of protected riders</div>
        <div style={c.label}>Full name</div>
        <input style={c.inp} placeholder="Arjun Kumar" value={form.name}
          onChange={e => setForm({...form, name:e.target.value})} />
        <div style={c.label}>Phone number</div>
        <input style={c.inp} placeholder="9876543210" type="tel" value={form.phone}
          onChange={e => setForm({...form, phone:e.target.value})} />
        <div style={c.label}>Your zone</div>
        <select style={c.inp} value={form.zone}
          onChange={e => setForm({...form, zone:e.target.value})}>
          {ZONES.map(z => <option key={z}>{z}</option>)}
        </select>
        {error && <div style={c.err}>{error}</div>}
        <button style={c.btnG} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Get protected →'}
        </button>
        <div style={c.link} onClick={() => navigate('/')}>
          Already registered? <span style={{color:'#22c55e',cursor:'pointer'}}>Login</span>
        </div>
        <div style={c.steps}>
          {['Register','Choose plan','Stay protected'].map((s,i) => (
            <div key={s} style={c.step}>
              <div style={{...c.stepNum, background: i===0 ? '#22c55e' : '#1e293b', color: i===0 ? '#000':'#94a3b8'}}>{i+1}</div>
              <div style={c.stepTxt}>{s}</div>
            </div>
          ))}
        </div>
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
  label: { fontSize:'11px', color:'#94a3b8', marginBottom:'5px' },
  inp: { width:'100%', background:'#1e293b', border:'1px solid #334155', borderRadius:'10px', padding:'12px 14px', color:'#fff', fontSize:'14px', marginBottom:'12px', boxSizing:'border-box', outline:'none' },
  btnG: { width:'100%', background:'#22c55e', color:'#000', fontWeight:'800', border:'none', borderRadius:'12px', padding:'14px', fontSize:'14px', cursor:'pointer', marginTop:'4px' },
  err: { color:'#f87171', fontSize:'12px', marginBottom:'8px' },
  link: { textAlign:'center', marginTop:'16px', fontSize:'13px', color:'#94a3b8' },
  steps: { display:'flex', justifyContent:'space-between', marginTop:'24px', background:'#1e293b', borderRadius:'14px', padding:'14px' },
  step: { textAlign:'center', flex:1 },
  stepNum: { width:'24px', height:'24px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', margin:'0 auto 6px' },
  stepTxt: { fontSize:'10px', color:'#94a3b8' },
};
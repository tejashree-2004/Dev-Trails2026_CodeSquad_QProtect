import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!phone) return setError('Enter your phone number');
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/login', { phone });
      localStorage.setItem('worker_id', res.data.worker_id);
      localStorage.setItem('worker_zone', res.data.zone);
      localStorage.setItem('worker_name', res.data.name);
      navigate('/dashboard');
    } catch {
      setError('Phone not found. Please register first.');
    }
    setLoading(false);
  };

  return (
    <div style={c.page}>
      <div style={c.phone}>
        <div style={c.logoRow}><span style={c.logo}>Q</span><span style={c.logoW}>Protect</span></div>
        <div style={c.pill}>Income Protection</div>
        <div style={c.h1}>Welcome back</div>
        <div style={c.sub}>Login with your registered phone</div>
        <div style={c.label}>Phone number</div>
        <input style={c.inp} placeholder="9876543210" value={phone}
          onChange={e => setPhone(e.target.value)} type="tel" />
        {error && <div style={c.err}>{error}</div>}
        <button style={c.btnG} onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login →'}
        </button>
        <div style={c.link} onClick={() => navigate('/register')}>
          New user? <span style={{color:'#22c55e',cursor:'pointer'}}>Register here</span>
        </div>
        <div style={c.infoCard}>
          <div style={c.infoLabel}>PROTECTED THIS MONTH</div>
          <div style={c.infoVal}>Zero-touch payouts</div>
          <div style={c.infoSub}>No claims · No paperwork · Auto UPI</div>
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
  infoCard: { marginTop:'24px', background:'#1e293b', borderRadius:'14px', padding:'16px' },
  infoLabel: { fontSize:'10px', color:'#94a3b8', letterSpacing:'0.5px', marginBottom:'6px' },
  infoVal: { fontSize:'18px', fontWeight:'800', color:'#22c55e' },
  infoSub: { fontSize:'11px', color:'#475569', marginTop:'4px' },
};
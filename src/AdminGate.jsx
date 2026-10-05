import { cloneElement, useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';

const sessionKey = 'icon-academy-admin-session';
const credentialDigest = 'c14e8875aae36c4f6293b3256b83b923ce0c3fac46f6952c088000bc118b76dc';
async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const result = await window.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(result)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export default function AdminGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    setAuthenticated(window.sessionStorage.getItem(sessionKey) === 'active');
  }, []);
  const login = async event => {
    event.preventDefault(); setMessage('');
    try {
      const entered = await digest(`${email.trim().toLowerCase()}:${password}`);
      if (entered !== credentialDigest) { setMessage('Email ya password theek nahi hai. Dobara check karein.'); return; }
      window.sessionStorage.setItem(sessionKey, 'active'); setAuthenticated(true);
    } catch { setMessage('Login verify nahi ho saka. Please modern browser mein try karein.'); }
  };
  const logout = () => { window.sessionStorage.removeItem(sessionKey); setAuthenticated(false); setPassword(''); setEmail(''); };
  if (authenticated) return <>{cloneElement(children, { onLogout: logout })}</>;
  return <main className="admin-login-page"><div className="admin-login-orbit admin-login-orbit-one" /><div className="admin-login-orbit admin-login-orbit-two" />
    <section className="admin-login-card"><a href="/" className="admin-login-brand"><img src="/images/icon-academy-logo.png" alt="" /><span><strong>THE ICON ACADEMY</strong><small>LAHORE · CONTENT DESK</small></span></a>
      <div className="admin-login-heading"><span><LockKeyhole size={19} /></span><p className="course-eyebrow"><Sparkles size={13} /> PRIVATE ADMIN AREA</p><h1>Welcome<br /><em>back.</em></h1><p>Sign in to manage events and study notes.</p></div>
      <form className="admin-login-form" onSubmit={login}><label>Email address<input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required /></label><label>Password<span className="admin-password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{message && <p className="admin-login-error" role="alert">{message}</p>}<button className="admin-login-submit" type="submit">Sign in to dashboard <ArrowRight size={17} /></button></form>
      <p className="admin-login-security"><ShieldCheck size={15} /> Your admin session lasts until this browser tab is closed.</p>
    </section><p className="admin-login-footer">THE ICON ACADEMY <span>·</span> CONTENT MANAGEMENT</p>
  </main>;
}

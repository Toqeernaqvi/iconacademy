import { cloneElement, useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseAuth } from './firebaseClient';
import { migrateLegacyAdminData } from './firebaseMigration';

const adminUid = 'pOGN5R17jRXBAxUHHWcb2kTqn2w1';

function authMessage(error) {
  if (error?.code === 'auth/invalid-credential') return 'Email ya password theek nahi hai. Dobara check karein.';
  if (error?.code === 'auth/user-disabled') return 'Yeh admin account disabled hai.';
  if (error?.code === 'auth/too-many-requests') return 'Bohat zyada attempts huay hain. Thori dair baad try karein.';
  if (error?.code === 'auth/network-request-failed') return 'Internet connection check karke dobara try karein.';
  if (error?.code === 'auth/operation-not-allowed') return 'Firebase Console mein Email/Password sign-in enable karein.';
  return 'Firebase login complete nahi ho saka. Configuration aur rules check karein.';
}

export default function AdminGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, async user => {
      if (!user) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }
      if (user.uid !== adminUid) {
        await signOut(firebaseAuth);
        setMessage('Yeh Firebase account Icon Academy admin ke liye authorized nahi hai.');
        setChecking(false);
        return;
      }
      try {
        await migrateLegacyAdminData();
        setAuthenticated(true);
      } catch (error) {
        await signOut(firebaseAuth);
        setMessage(error?.code === 'PERMISSION_DENIED' || error?.code === 'permission-denied'
          ? 'Firebase Database/Storage rules publish nahi hui. Rules deploy karke dobara login karein.'
          : 'Firebase data initialize nahi ho saka. Database aur Storage rules check karein.');
      } finally {
        setChecking(false);
      }
    });
  }, []);
  const login = async event => {
    event.preventDefault(); setMessage(''); setChecking(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    } catch (error) {
      setChecking(false);
      setMessage(authMessage(error));
    }
  };
  const logout = async () => { await signOut(firebaseAuth); setPassword(''); setEmail(''); };
  if (authenticated) return <>{cloneElement(children, { onLogout: logout })}</>;
  return <main className="admin-login-page"><div className="admin-login-orbit admin-login-orbit-one" /><div className="admin-login-orbit admin-login-orbit-two" />
    <section className="admin-login-card"><a href="/" className="admin-login-brand"><img src="/images/icon-academy-logo.png" alt="" /><span><strong>THE ICON ACADEMY</strong><small>LAHORE · CONTENT DESK</small></span></a>
      <div className="admin-login-heading"><span><LockKeyhole size={19} /></span><p className="course-eyebrow"><Sparkles size={13} /> PRIVATE ADMIN AREA</p><h1>Welcome<br /><em>back.</em></h1><p>Sign in to manage fees, salaries, expenses and website content.</p></div>
      <form className="admin-login-form" onSubmit={login}><label>Email address<input type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required /></label><label>Password<span className="admin-password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{message && <p className="admin-login-error" role="alert">{message}</p>}<button className="admin-login-submit" type="submit" disabled={checking}>{checking ? 'Connecting to Firebase...' : 'Sign in to dashboard'} <ArrowRight size={17} /></button></form>
      <p className="admin-login-security"><ShieldCheck size={15} /> Protected by Firebase Authentication and secure database rules.</p>
    </section><p className="admin-login-footer">THE ICON ACADEMY <span>·</span> CONTENT MANAGEMENT</p>
  </main>;
}

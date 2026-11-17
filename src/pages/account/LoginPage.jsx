import { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './account.css';

function LoginPage() {
  const [email, setEmail] = useState('demo@prizebustershop.com');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign in · Prize Buster Shop';
  }, []);

  if (isAuthenticated) return <Navigate to="/account" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = await signIn(email, password);
      const destination = location.state?.from?.pathname || '/account';
      navigate(destination, { replace: true, state: { welcomeName: user.name } });
    } catch (loginError) {
      setError(loginError.message || 'We could not sign you in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="account-login">
      <nav className="account-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Sign in</span>
      </nav>
      <div className="account-login__card">
        <span className="account-eyebrow">Welcome back</span>
        <h1>Make yourself at home.</h1>
        <p>Sign in to see your orders, saved addresses and favourite finds.</p>
        {error ? <p className="account-alert account-alert--error" role="alert">{error}</p> : null}
        <form className="account-form" onSubmit={handleSubmit}>
          <label className="account-field">
            <span>Email address</span>
            <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="account-field account-field--password">
            <span>Password</span>
            <span className="account-password-wrap">
              <input type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" aria-label="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button type="button" className="account-password-toggle" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? 'Hide password' : 'Show password'}>
                {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          <button className="account-button account-login__submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={15} />
          </button>
        </form>
        <div className="account-login__demo">
          <strong>Demo account</strong>
          <span>demo@prizebustershop.com</span>
          <span>Password: password123</span>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;

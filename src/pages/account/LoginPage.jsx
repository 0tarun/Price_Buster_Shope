import { useEffect, useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import './account.css';

function LoginPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, isLoading, signIn, signUp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isRegistering = mode === 'register';

  useEffect(() => {
    document.title = `${isRegistering ? 'Create account' : 'Log in'} · Prize Buster Shop`;
  }, [isRegistering]);

  if (isLoading) {
    return <div className="page-loader-wrap"><div className="page-loader">Checking your account…</div></div>;
  }

  if (isAuthenticated) return <Navigate to="/account" replace />;

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setPassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const user = isRegistering
        ? await signUp({ name, email, password })
        : await signIn(email, password, rememberMe);
      const destination = location.state?.from?.pathname || '/account';
      navigate(destination, { replace: true, state: { welcomeName: user.name } });
    } catch (authError) {
      setError(authError.message || 'We could not sign you in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="account-login">
      <div className="account-login__layout">
        <aside className="account-login__promo">
          <span className="account-login__promo-label">A little something for you</span>
          <h2>Good finds.<br />Even better together.</h2>
          <p>Your favourites, your orders, your little everyday wins.</p>
        </aside>

        <div className="account-login__card">
          <header className="account-login__heading">
            <span className="account-eyebrow">{isRegistering ? 'Join the good finds' : 'Welcome back'}</span>
            <h1>{isRegistering ? 'Create your account.' : 'Your next good find is waiting for you.'}</h1>
            <p>
              {isRegistering
                ? 'Create an account to keep your orders and favourites together.'
                : 'Sign in to see your orders, saved addresses and favourite finds.'}
            </p>
          </header>

          <div className="account-login__tabs" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={!isRegistering}
              aria-controls="account-login-form"
              className={!isRegistering ? 'is-active' : ''}
              disabled={submitting}
              onClick={() => changeMode('login')}
            >
              Log in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isRegistering}
              aria-controls="account-login-form"
              className={isRegistering ? 'is-active' : ''}
              disabled={submitting}
              onClick={() => changeMode('register')}
            >
              Create account
            </button>
          </div>

          {error ? <p className="account-alert account-alert--error" role="alert">{error}</p> : null}

          <form
            id="account-login-form"
            className="account-form"
            aria-label={isRegistering ? 'Create account' : 'Log in'}
            onSubmit={handleSubmit}
          >
            {isRegistering ? (
              <div className="account-login__register-row">
                <label className="account-field" htmlFor="account-name">
                  <span>Full name</span>
                  <input
                    id="account-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength="80"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </label>
                <label className="account-field account-field--password" htmlFor="account-password">
                  <span>Password</span>
                  <span className="account-password-wrap">
                    <input
                      id="account-password"
                      name="password"
                      type={passwordVisible ? 'text' : 'password'}
                      autoComplete="new-password"
                      minLength="8"
                      maxLength="128"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="account-password-toggle"
                      onClick={() => setPasswordVisible((visible) => !visible)}
                      aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    >
                      {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </span>
                </label>
                <p className="account-login__password-note">Use at least 8 characters.</p>
              </div>
            ) : null}

            <label className="account-field" htmlFor="account-email">
              <span>Email address</span>
              <input
                id="account-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength="254"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            {!isRegistering ? (
              <label className="account-field account-field--password" htmlFor="account-password">
                <span>Password</span>
                <span className="account-password-wrap">
                  <input
                    id="account-password"
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    maxLength="128"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="account-password-toggle"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  >
                    {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>
            ) : null}

            {!isRegistering ? (
              <div className="account-login__options">
                <label className="account-login__remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
                <a href="mailto:hello@prizebustershop.com?subject=Password%20reset">Forgot password?</a>
              </div>
            ) : null}

            <button className="account-button account-login__submit" type="submit" disabled={submitting}>
              {submitting ? (isRegistering ? 'Creating account…' : 'Signing in…') : (isRegistering ? 'Create account' : 'Log in')}
              {!submitting ? <ArrowRight size={15} /> : null}
            </button>
          </form>

          <div className="account-login__divider"><span>or continue with</span></div>
          <button
            className="account-login__google"
            type="button"
            disabled
            title="Google sign-in will be enabled later"
            aria-label={isRegistering ? 'Sign up with Google (not available yet)' : 'Continue with Google (not available yet)'}
          >
            <span className="account-login__google-mark" aria-hidden="true">G</span>
            {isRegistering ? 'Sign up with Google' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;

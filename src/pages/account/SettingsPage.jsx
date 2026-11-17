import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useCart } from '../../context/useCart';
import { getPreferences, savePreferences, updatePassword } from '../../services/api';

const initialPassword = { currentPassword: '', newPassword: '', confirmPassword: '' };
const preferenceFields = [
  { key: 'orderUpdates', label: 'Order updates by email' },
  { key: 'offers', label: 'New finds and exclusive offers' },
  { key: 'stories', label: 'Product tips and journal stories' },
];

function SettingsPage() {
  const [password, setPassword] = useState(initialPassword);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [preferences, setPreferences] = useState({ orderUpdates: true, offers: true, stories: false });
  const [savedPreferences, setSavedPreferences] = useState({ orderUpdates: true, offers: true, stories: false });
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useCart();

  useEffect(() => {
    let active = true;
    getPreferences()
      .then((result) => {
        if (active) {
          setPreferences(result);
          setSavedPreferences(result);
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'We could not load your preferences.');
      })
      .finally(() => {
        if (active) setPreferencesLoading(false);
      });
    return () => { active = false; };
  }, []);

  const preferencesChanged = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(savedPreferences),
    [preferences, savedPreferences],
  );

  const updatePasswordField = (event) => {
    setPassword((current) => ({ ...current, [event.target.name]: event.target.value }));
    setPasswordErrors((current) => ({ ...current, [event.target.name]: '' }));
    setError('');
  };

  const validatePassword = () => {
    const errors = {};
    if (!password.currentPassword) errors.currentPassword = 'Enter your current password.';
    if (password.newPassword.length < 8) errors.newPassword = 'Use at least 8 characters.';
    if (!password.confirmPassword) errors.confirmPassword = 'Confirm your new password.';
    else if (password.newPassword !== password.confirmPassword) errors.confirmPassword = 'These passwords do not match.';
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword()) return;
    setPasswordSaving(true);
    setError('');
    try {
      await updatePassword({ currentPassword: password.currentPassword, newPassword: password.newPassword });
      setPassword(initialPassword);
      setPasswordErrors({});
      showToast('Password updated');
    } catch (saveError) {
      setPasswordErrors((current) => ({ ...current, currentPassword: saveError.message || 'Your current password is incorrect.' }));
    } finally {
      setPasswordSaving(false);
    }
  };

  const toggleVisibility = (field) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  const handlePreferenceChange = (event) => {
    setPreferences((current) => ({ ...current, [event.target.name]: event.target.checked }));
  };

  const handlePreferencesSubmit = async (event) => {
    event.preventDefault();
    setPreferencesSaving(true);
    setError('');
    try {
      await savePreferences(preferences);
      setSavedPreferences(preferences);
      showToast('Preferences saved');
    } catch (saveError) {
      setError(saveError.message || 'Your preferences could not be saved.');
    } finally {
      setPreferencesSaving(false);
    }
  };

  return (
    <div className="account-page-content account-settings">
      {error ? <p className="account-alert account-alert--error" role="alert">{error}</p> : null}
      <section className="account-section">
        <div className="account-section__header">
          <div>
            <span className="account-eyebrow">Keep your account safe</span>
            <h2>Password &amp; security</h2>
          </div>
        </div>
        <form className="account-form" onSubmit={handlePasswordSubmit} noValidate>
          <label className="account-field account-field--password">
            <span>Current password</span>
            <span className="account-password-wrap">
              <input
                type={visiblePasswords.currentPassword ? 'text' : 'password'}
                name="currentPassword"
                autoComplete="current-password"
                aria-label="Current password"
                value={password.currentPassword}
                onChange={updatePasswordField}
                aria-invalid={Boolean(passwordErrors.currentPassword)}
                aria-describedby={passwordErrors.currentPassword ? 'current-password-error' : undefined}
              />
              <button type="button" className="account-password-toggle" onClick={() => toggleVisibility('currentPassword')} aria-label={visiblePasswords.currentPassword ? 'Hide current password' : 'Show current password'}>
                {visiblePasswords.currentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
            {passwordErrors.currentPassword ? <span className="account-field__error" id="current-password-error">{passwordErrors.currentPassword}</span> : null}
          </label>

          <div className="account-form__grid account-form__grid--password">
            {[
              { name: 'newPassword', label: 'New password', placeholder: 'At least 8 characters', autoComplete: 'new-password' },
              { name: 'confirmPassword', label: 'Confirm new password', placeholder: 'Repeat new password', autoComplete: 'new-password' },
            ].map((field) => (
              <label className="account-field account-field--password" key={field.name}>
                <span>{field.label}</span>
                <span className="account-password-wrap">
                  <input
                    type={visiblePasswords[field.name] ? 'text' : 'password'}
                    name={field.name}
                    autoComplete={field.autoComplete}
                    aria-label={field.label}
                    placeholder={field.placeholder}
                    value={password[field.name]}
                    onChange={updatePasswordField}
                    aria-invalid={Boolean(passwordErrors[field.name])}
                    aria-describedby={passwordErrors[field.name] ? `${field.name}-error` : undefined}
                  />
                  <button type="button" className="account-password-toggle" onClick={() => toggleVisibility(field.name)} aria-label={`${visiblePasswords[field.name] ? 'Hide' : 'Show'} ${field.label.toLowerCase()}`}>
                    {visiblePasswords[field.name] ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
                {passwordErrors[field.name] ? <span className="account-field__error" id={`${field.name}-error`}>{passwordErrors[field.name]}</span> : null}
              </label>
            ))}
          </div>
          <button type="submit" className="account-button" disabled={passwordSaving}>{passwordSaving ? 'Updating…' : 'Update password'}</button>
        </form>
      </section>

      <section className="account-section account-section--spaced">
        <div className="account-section__header">
          <div>
            <span className="account-eyebrow">Only the good stuff</span>
            <h2>A little news, your way.</h2>
          </div>
        </div>
        <form className="account-preferences" onSubmit={handlePreferencesSubmit}>
          <div className="account-preferences__list">
            {preferenceFields.map(({ key, label }) => (
              <label className="account-checkbox" key={key}>
                <input type="checkbox" name={key} checked={Boolean(preferences[key])} onChange={handlePreferenceChange} disabled={preferencesLoading} />
                <span className="account-checkbox__box" aria-hidden="true" />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className={`account-button account-button--preferences${preferencesChanged ? ' is-dirty' : ''}`}
            disabled={!preferencesChanged || preferencesLoading || preferencesSaving}
          >
            {preferencesSaving ? 'Saving…' : 'Save preferences'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default SettingsPage;

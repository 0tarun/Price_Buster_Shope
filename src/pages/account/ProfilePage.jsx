import { useEffect, useState } from 'react';
import { ArrowRight, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile } from '../../services/api';
import { useCart } from '../../context/useCart';
import { useAuth } from '../../context/useAuth';

const emptyProfile = { name: '', email: '', phone: '', dateOfBirth: '' };
const profileFields = [
  {
    name: 'name',
    id: 'profile-name',
    label: 'Full name',
    type: 'text',
    autoComplete: 'name',
    hint: 'Your name as it appears in your account.',
  },
  {
    name: 'email',
    id: 'profile-email',
    label: 'Email address',
    type: 'email',
    autoComplete: 'email',
    hint: 'Used for account updates and order receipts.',
  },
  {
    name: 'phone',
    id: 'profile-phone',
    label: 'Phone number',
    type: 'tel',
    autoComplete: 'tel',
    hint: 'Helpful for delivery updates from the courier.',
  },
  {
    name: 'dateOfBirth',
    id: 'profile-date-of-birth',
    label: 'Date of birth',
    type: 'date',
    hint: 'Optional. You can leave this blank.',
  },
];

function ProfilePage() {
  const [profile, setProfile] = useState(emptyProfile);
  const [savedProfile, setSavedProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useCart();
  const { updateUser } = useAuth();
  const hasChanges = JSON.stringify(profile) !== JSON.stringify(savedProfile);
  const initials = profile.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U';

  useEffect(() => {
    let active = true;
    getProfile()
      .then((result) => {
        if (active) {
          const loadedProfile = { ...emptyProfile, ...result };
          setProfile(loadedProfile);
          setSavedProfile(loadedProfile);
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'We could not load your profile.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const updateField = (event) => {
    setError('');
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(profile);
      const committedProfile = { ...profile };
      setProfile(committedProfile);
      setSavedProfile(committedProfile);
      updateUser(committedProfile);
      showToast('Profile saved');
    } catch (saveError) {
      setError(saveError.message || 'Your profile could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="account-loading">Loading your profile…</p>;

  return (
    <section className="account-section profile-page">
      {error ? <p className="account-alert account-alert--error" role="alert">{error}</p> : null}
      <div className="profile-page__grid">
        <form className="profile-form-card" onSubmit={handleSubmit}>
          <div className="profile-form-card__header">
            <div>
              <span className="account-eyebrow">Your account details</span>
              <h2>Personal information</h2>
              <p>Keep these details current for a smoother shop and delivery experience.</p>
            </div>
            <span className="profile-form-card__icon" aria-hidden="true"><UserRound size={19} /></span>
          </div>

          <div className="profile-form__grid">
            {profileFields.map((field) => (
              <div className="profile-field-group" key={field.name}>
                <label className="account-field" htmlFor={field.id}>
                  <span>{field.label}</span>
                  <input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={profile[field.name]}
                    onChange={updateField}
                    required={field.name === 'name' || field.name === 'email'}
                  />
                </label>
                <span className="profile-field__hint">{field.hint}</span>
              </div>
            ))}
          </div>

          <div className="profile-form-card__footer">
            <span className={`profile-save-status${hasChanges ? ' is-dirty' : ''}`} aria-live="polite">
              <span className="profile-save-status__dot" aria-hidden="true" />
              {hasChanges ? 'You have unsaved changes' : 'Your details are up to date'}
            </span>
            <button className="account-button" type="submit" disabled={saving || !hasChanges}>
              {saving ? 'Saving…' : 'Save changes'}
              {!saving ? <ArrowRight size={14} /> : null}
            </button>
          </div>
        </form>

        <aside className="profile-aside" aria-label="Profile summary and account shortcuts">
          <section className="profile-identity-card">
            <span className="profile-identity-card__eyebrow">Your profile</span>
            <span className="profile-identity-card__avatar" aria-hidden="true">{initials}</span>
            <h3>{profile.name || 'Your name'}</h3>
            <p>{profile.email || 'Add an email address to your profile'}</p>
            <span className="profile-identity-card__note">Personal details, all in one place.</span>
          </section>

          <section className="profile-shortcuts">
            <span className="account-eyebrow">Account shortcuts</span>
            <Link to="/account/settings" className="profile-shortcut">
              <span className="profile-shortcut__icon"><ShieldCheck size={17} /></span>
              <span className="profile-shortcut__copy">
                <strong>Security &amp; preferences</strong>
                <small>Manage your password and updates</small>
              </span>
              <ArrowRight size={15} />
            </Link>
            <Link to="/account/addresses" className="profile-shortcut">
              <span className="profile-shortcut__icon"><MapPin size={17} /></span>
              <span className="profile-shortcut__copy">
                <strong>Saved addresses</strong>
                <small>Choose where your finds arrive</small>
              </span>
              <ArrowRight size={15} />
            </Link>
          </section>
        </aside>
      </div>
    </section>
  );
}

export default ProfilePage;

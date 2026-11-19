import { useEffect, useState } from 'react';
import { MapPin, Plus, Star, Trash2 } from 'lucide-react';
import { deleteAddress, getAddresses, saveAddress, setDefaultAddress } from '../../services/api';
import { useCart } from '../../context/useCart';

const blankAddress = { label: '', recipient: '', phone: '', street: '', city: '', postalCode: '', isDefault: false };

function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [draft, setDraft] = useState(blankAddress);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useCart();

  const refresh = async () => setAddresses(await getAddresses());

  useEffect(() => {
    let active = true;
    getAddresses()
      .then((result) => { if (active) setAddresses(result); })
      .catch((loadError) => { if (active) setError(loadError.message || 'We could not load your addresses.'); });
    return () => { active = false; };
  }, []);

  const startNew = () => {
    setDraft({ ...blankAddress, isDefault: addresses.length === 0 });
    setEditingId(null);
    setFormOpen(true);
    setError('');
  };

  const startEdit = (address) => {
    setDraft({ ...address });
    setEditingId(address.id);
    setFormOpen(true);
    setError('');
  };

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setDraft((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await saveAddress({ ...draft, id: editingId || undefined });
      await refresh();
      setFormOpen(false);
      showToast(editingId ? 'Address updated' : 'Address added');
    } catch (saveError) {
      setError(saveError.message || 'Your address could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteAddress(id);
      await refresh();
      showToast('Address removed');
    } catch (deleteError) {
      setError(deleteError.message || 'This address could not be removed.');
    }
  };

  const handleDefault = async (id) => {
    setError('');
    try {
      await setDefaultAddress(id);
      await refresh();
      showToast('Default address updated');
    } catch (updateError) {
      setError(updateError.message || 'Default address could not be updated.');
    }
  };

  return (
    <section className="account-section">
      <div className="account-section__header">
        <div>
          <span className="account-eyebrow">Ready when you are</span>
          <h2>Saved addresses</h2>
        </div>
        {!formOpen ? (
          <button type="button" className="account-button account-button--secondary" onClick={startNew}>
            <Plus size="0.9375rem" /> Add address
          </button>
        ) : null}
      </div>
      {error ? <p className="account-alert account-alert--error" role="alert">{error}</p> : null}

      {formOpen ? (
        <form className="account-form account-address-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit address' : 'Add a new address'}</h3>
          <div className="account-form__grid">
            <label className="account-field">
              <span>Address label</span>
              <input name="label" value={draft.label} onChange={updateField} placeholder="Home, work…" required />
            </label>
            <label className="account-field">
              <span>Recipient name</span>
              <input name="recipient" autoComplete="name" value={draft.recipient} onChange={updateField} required />
            </label>
            <label className="account-field">
              <span>Phone number</span>
              <input name="phone" type="tel" autoComplete="tel" value={draft.phone} onChange={updateField} required />
            </label>
            <label className="account-field">
              <span>Street address</span>
              <input name="street" autoComplete="street-address" value={draft.street} onChange={updateField} required />
            </label>
            <label className="account-field">
              <span>City</span>
              <input name="city" autoComplete="address-level2" value={draft.city} onChange={updateField} required />
            </label>
            <label className="account-field">
              <span>Postal code</span>
              <input name="postalCode" autoComplete="postal-code" value={draft.postalCode} onChange={updateField} required />
            </label>
          </div>
          <label className="account-checkbox account-address-form__default">
            <input type="checkbox" name="isDefault" checked={draft.isDefault} onChange={updateField} />
            <span className="account-checkbox__box" aria-hidden="true" />
            <span>Make this my default address</span>
          </label>
          <div className="account-form__actions">
            <button type="submit" className="account-button" disabled={saving}>{saving ? 'Saving…' : 'Save address'}</button>
            <button type="button" className="account-button account-button--quiet" onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : null}

      <div className="account-address-grid">
        {addresses.map((address) => (
          <article className="account-address-card" key={address.id}>
            <div className="account-address-card__top">
              <span className="account-address-card__icon"><MapPin size="1.0625rem" /></span>
              <div>
                <h3>{address.label}</h3>
                {address.isDefault ? <span className="account-default-label"><Star size="0.75rem" fill="currentColor" /> Default</span> : null}
              </div>
            </div>
            <p><strong>{address.recipient}</strong><br />{address.phone}<br />{address.street}<br />{address.city}, {address.postalCode}</p>
            <div className="account-address-card__actions">
              <button type="button" className="account-text-button" onClick={() => startEdit(address)}>Edit</button>
              {!address.isDefault ? <button type="button" className="account-text-button" onClick={() => handleDefault(address.id)}>Set default</button> : null}
              <button type="button" className="account-icon-button" onClick={() => handleDelete(address.id)} aria-label={`Delete ${address.label} address`}><Trash2 size="0.9375rem" /></button>
            </div>
          </article>
        ))}
        {!addresses.length && !formOpen && !error ? <p className="account-empty">Save an address to make checkout quicker next time.</p> : null}
      </div>
    </section>
  );
}

export default AddressesPage;

import { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function ServiceConnectionModal({ service, onClose, onSave }) {
  const [method, setMethod] = useState(service.hasApi ? 'connect' : 'manual');
  const [formData, setFormData] = useState({
    price: service.defaultPrice || '',
    interval: service.defaultInterval || 'monthly',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, method }); // Pass back data to parent
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', border: '1px solid var(--border-subtle)', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)' }} aria-label="Close">
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src={service.logo} alt={service.name} style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '1rem', objectFit: 'cover' }} />
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Add {service.name}</h2>
        </div>

        {service.hasApi && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
            <button
              onClick={() => setMethod('connect')}
              style={{
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid',
                backgroundColor: method === 'connect' ? 'var(--primary)' : 'transparent',
                borderColor: method === 'connect' ? 'var(--primary)' : 'var(--border-subtle)',
                color: method === 'connect' ? 'white' : 'var(--text-secondary)'
              }}
            >
              Connect API
            </button>
            <button
              onClick={() => setMethod('manual')}
              style={{
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid',
                backgroundColor: method === 'manual' ? 'var(--primary)' : 'transparent',
                borderColor: method === 'manual' ? 'var(--primary)' : 'var(--border-subtle)',
                color: method === 'manual' ? 'white' : 'var(--text-secondary)'
              }}
            >
              Manual Entry
            </button>
          </div>
        )}

        {method === 'manual' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div>
              <label htmlFor="price" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price</label>
              <input
                id="price"
                type="number" step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
                required
              />
            </div>
             <div>
              <label htmlFor="interval" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Billing Interval</label>
              <select
                id="interval"
                value={formData.interval}
                onChange={(e) => setFormData({...formData, interval: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}
              >
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 600
              }}
            >
              <Check size={20} />
              Add Subscription
            </button>
          </form>
        )}

        {method === 'connect' && (
           <div style={{ textAlign: 'center', padding: '2rem 0' }}>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>We will redirect you to {service.name} to authorize access.</p>
             <button
              onClick={() => onSave({ method: 'connect' })}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 600, margin: '0 auto'
              }}
            >
              Connect Now
            </button>
           </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    managementUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'services'), {
        name: formData.name,
        logo: formData.logo,
        managementUrl: formData.managementUrl,
        hasApi: false
      });
      setMessage('Service added successfully!');
      setFormData({ name: '', logo: '', managementUrl: '' });
    } catch (error) {
      console.error("Error adding service: ", error);
      setMessage('Error adding service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h1>

      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add New Service</h2>

        {message && <p style={{ color: message.includes('Error') ? 'var(--danger)' : 'var(--success)', marginBottom: '1rem' }}>{message}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Service Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Netflix"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label htmlFor="logo" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Logo URL</label>
            <input
              id="logo"
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="e.g. https://netflix.com/logo.png"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label htmlFor="managementUrl" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Management URL</label>
            <input
              id="managementUrl"
              type="url"
              name="managementUrl"
              value={formData.managementUrl}
              onChange={handleChange}
              placeholder="e.g. https://netflix.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            <Plus size={18} />
            {loading ? 'Adding...' : 'Add Service'}
          </button>
        </form>
      </div>
    </div>
  );
}

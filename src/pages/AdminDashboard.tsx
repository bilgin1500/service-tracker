import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Plus } from 'lucide-react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    managementUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'services'), {
        name: formData.name,
        logo: formData.logo,
        managementUrl: formData.managementUrl,
        hasApi: false,
      });
      setMessage('Service added successfully!');
      setFormData({ name: '', logo: '', managementUrl: '' });
    } catch (error) {
      console.error('Error adding service: ', error);
      setMessage('Error adding service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Add New Service</h2>

        {message && (
          <p
            className={`${styles.message} ${message.includes('Error') ? styles.messageError : styles.messageSuccess}`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Service Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Netflix"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="logo" className={styles.label}>
              Logo URL
            </label>
            <input
              id="logo"
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="e.g. https://netflix.com/logo.png"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="managementUrl" className={styles.label}>
              Management URL
            </label>
            <input
              id="managementUrl"
              type="url"
              name="managementUrl"
              value={formData.managementUrl}
              onChange={handleChange}
              placeholder="e.g. https://netflix.com"
              required
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            <Plus size={18} />
            {loading ? 'Adding...' : 'Add Service'}
          </button>
        </form>
      </div>
    </div>
  );
}

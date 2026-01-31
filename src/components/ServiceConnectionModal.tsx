import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Service } from '../types';
import styles from './ServiceConnectionModal.module.css';

interface ServiceConnectionModalProps {
  service: Service;
  onClose: () => void;
  onSave: (data: any) => Promise<void>; // TODO: typed data
}

export default function ServiceConnectionModal({
  service,
  onClose,
  onSave,
}: ServiceConnectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    price: service.defaultPrice?.toString() || '',
    interval: service.defaultInterval || 'monthly',
    method: service.hasApi ? 'connect' : 'manual',
  });

  const method = formData.method;
  const setMethod = (newMethod: string) =>
    setFormData({ ...formData, method: newMethod });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API connection or just save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await onSave(formData);
    setLoading(false);
    setTimeout(onClose, 1500);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className={styles.header}>
          <img src={service.logo} alt={service.name} className={styles.logo} />
          <h2 className={styles.title}>Add {service.name}</h2>
        </div>

        {service.hasApi && (
          <div className={styles.methodToggle}>
            <button
              onClick={() => setMethod('connect')}
              className={`${styles.methodButton} ${method === 'connect' ? styles.active : ''}`}
            >
              Connect API
            </button>
            <button
              onClick={() => setMethod('manual')}
              className={`${styles.methodButton} ${method === 'manual' ? styles.active : ''}`}
            >
              Manual Entry
            </button>
          </div>
        )}

        {method === 'manual' && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Price (per {formData.interval})
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="interval" className={styles.label}>
                Billing Interval
              </label>
              <select
                id="interval"
                value={formData.interval}
                onChange={(e) =>
                  setFormData({ ...formData, interval: e.target.value })
                }
                className={styles.select}
              >
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              <Check size={20} />
              Add Subscription
            </button>
          </form>
        )}

        {method === 'connect' && (
          <div className={styles.connectSection}>
            <p className={styles.connectText}>
              We will redirect you to {service.name} to authorize access.
            </p>
            <button
              onClick={() => onSave({ method: 'connect' })}
              className={styles.connectButton}
            >
              Connect Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

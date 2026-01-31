import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Service Tracker</h1>
        <p className={styles.subtitle}>
          Manage all your subscriptions in one place.
        </p>

        <button onClick={handleLogin} className={styles.button}>
          <LogIn size={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

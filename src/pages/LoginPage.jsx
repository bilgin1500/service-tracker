import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          textAlign: 'center',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h1 style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 600 }}>
          Service Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Manage all your subscriptions in one place.
        </p>

        <button
          onClick={handleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'background-color 0.2s',
            width: '100%',
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = 'var(--primary-hover)')
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = 'var(--primary)')
          }
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LogOut, Plus } from 'lucide-react';
import ServiceConnectionModal from '../components/ServiceConnectionModal';
import { Service, Subscription } from '../types';

export default function Dashboard() {
  const { logout, currentUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]); // Initialize empty
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const handleSaveSubscription = async (data: any) => {
    if (!currentUser || !selectedService) return;
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'subscriptions'), {
        serviceId: selectedService.id,
        name: selectedService.name,
        price: data.price,
        interval: data.interval,
        status: 'active',
        method: data.method,
        managementUrl: selectedService.managementUrl || '',
      });
      setSelectedService(null);
      // Refresh local state
      if (currentUser) {
        const subsSnapshot = await getDocs(
          collection(db, 'users', currentUser.uid, 'subscriptions')
        );
        const fetchedSubs = subsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Subscription[];
        setSubscriptions(fetchedSubs);
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Available Services
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const fetchedServices = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];
        setServices(fetchedServices);

        // Fetch User Subscriptions
        if (currentUser) {
          const subsSnapshot = await getDocs(
            collection(db, 'users', currentUser.uid, 'subscriptions')
          );
          const fetchedSubs = subsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Subscription[];
          setSubscriptions(fetchedSubs);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUser]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
            My Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Welcome back, {currentUser?.displayName || 'User'}
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--text-primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      {subscriptions.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            My Subscriptions
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  border: '1px solid var(--primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h3
                    style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}
                  >
                    {sub.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--success)',
                      color: 'black',
                      fontWeight: 600,
                    }}
                  >
                    {sub.status}
                  </span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  ${sub.price}{' '}
                  <span
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 400,
                    }}
                  >
                    /{sub.interval}
                  </span>
                </div>
                {sub.method === 'connect' ? (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Synced via API
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Manual Entry
                  </span>
                )}
                <a
                  href={sub.managementUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    marginTop: '1rem',
                    textAlign: 'center',
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                  }}
                >
                  Manage Subscription
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2
          style={{
            fontSize: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          Available Services
          <button
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-full)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={16} />
          </button>
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading services...</p>
        ) : services.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>
            No services found. Ask admin to add some!
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <img
                  src={service.logo}
                  alt={service.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/48?text=' + service.name[0];
                  }}
                />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                  {service.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedService && (
        <ServiceConnectionModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSave={handleSaveSubscription}
        />
      )}
    </div>
  );
}

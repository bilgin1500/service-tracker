import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LogOut, Plus } from 'lucide-react';
import ServiceConnectionModal from '../components/ServiceConnectionModal';
import { Service, Subscription, SubscriptionFormData } from '../types';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { logout, currentUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]); // Initialize empty
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const handleSaveSubscription = async (data: SubscriptionFormData) => {
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
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>My Dashboard</h1>
          <p className={styles.welcomeText}>
            Welcome back, {currentUser?.displayName || 'User'}
          </p>
        </div>
        <button onClick={logout} className={styles.signOutButton}>
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      {subscriptions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>My Subscriptions</h2>
          <div className={styles.grid}>
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`${styles.card} ${styles.cardActive}`}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.serviceName}>{sub.name}</h3>
                  <span className={styles.statusBadge}>{sub.status}</span>
                </div>
                <div className={styles.price}>
                  ${sub.price}{' '}
                  <span className={styles.interval}>/{sub.interval}</span>
                </div>
                {sub.method === 'connect' ? (
                  <span className={styles.syncedText}>Synced via API</span>
                ) : (
                  <span className={styles.manualText}>Manual Entry</span>
                )}
                <a
                  href={sub.managementUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.manageLink}
                >
                  Manage Subscription
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className={styles.sectionHeader}>
          Available Services
          <button className={styles.addButton}>
            <Plus size={16} />
          </button>
        </h2>

        {loading ? (
          <p className={styles.loadingText}>Loading services...</p>
        ) : services.length === 0 ? (
          <p className={styles.emptyText}>
            No services found. Ask admin to add some!
          </p>
        ) : (
          <div className={styles.grid}>
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className={styles.serviceCard}
              >
                <img
                  src={service.logo}
                  alt={service.name}
                  className={styles.serviceLogo}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/48?text=' + service.name[0];
                  }}
                />
                <h3 className={styles.serviceTitle}>{service.name}</h3>
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

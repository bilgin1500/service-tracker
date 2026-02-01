export interface Service {
  id: string;
  name: string;
  logo: string;
  managementUrl?: string;
  hasApi?: boolean;
  defaultPrice?: number;
  defaultInterval?: string;
}

export interface Subscription {
  id: string;
  serviceId?: string;
  name: string;
  price: number | string;
  interval: string; // 'monthly' | 'yearly'
  status: string; // 'active' | 'inactive'
  method: string; // 'connect' | 'manual'
  managementUrl?: string;
}
export interface SubscriptionFormData {
  price?: string;
  interval?: string;
  method: 'connect' | 'manual';
}

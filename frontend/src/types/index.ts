export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'freelancer' | 'client' | 'admin';
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  url: string;
  type: 'image' | 'video';
  publicId: string;
}

export interface FreelancerProfile {
  _id: string;
  user: User | string;
  displayName?: string;
  category: 'bodyguard' | 'anchor' | 'actor' | 'model' | 'dancer' | 'others';
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  dailyRate?: number;
  location?: string;
  isAvailable: boolean;
  media: Media[];
  rating: number;
  jobsCompleted: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  client: User | string;
  freelancer: FreelancerProfile | string;
  title: string;
  description?: string;
  jobDate: string;
  durationType: 'hourly' | 'daily';
  hoursOrDays: number;
  price: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  payment?: Payment | string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  job: Job | string;
  amount: number;
  currency: string;
  provider: 'mock' | 'stripe';
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  providerPaymentId?: string;
  receiptEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
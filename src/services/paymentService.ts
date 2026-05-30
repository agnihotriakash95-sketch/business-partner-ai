import type { PaymentRecord, SubscriptionPlan, UserProfile } from '../types';
import { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const checkoutSubscription = async (plan: SubscriptionPlan, amount: number, profile: UserProfile): Promise<PaymentRecord> => {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  let checkoutKey = key;
  let orderId: string | undefined;

  if (functions && plan !== 'free') {
    const callable = httpsCallable<{ plan: SubscriptionPlan; amount: number }, { keyId: string; orderId: string }>(functions, 'createRazorpayOrder');
    const result = await callable({ plan, amount });
    checkoutKey = result.data.keyId;
    orderId = result.data.orderId;
  }

  if (!checkoutKey) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      id: crypto.randomUUID(),
      ownerId: profile.id,
      plan,
      amount,
      status: 'demo',
      provider: 'razorpay',
      providerPaymentId: 'demo-payment',
      createdAt: new Date().toISOString(),
    };
  }

  const loaded = await loadRazorpay();
  if (!loaded || !window.Razorpay) {
    throw new Error('Razorpay checkout could not be loaded. Check network connection and retry.');
  }

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay!({
      key: checkoutKey,
      order_id: orderId,
      amount: amount * 100,
      currency: 'INR',
      name: 'Business Partner AI',
      description: `${plan.toUpperCase()} subscription`,
      prefill: {
        name: profile.name,
        email: profile.email,
        contact: '7651876597',
      },
      theme: {
        color: '#06b6d4',
      },
      handler: (response) => {
        resolve({
          id: crypto.randomUUID(),
          ownerId: profile.id,
          plan,
          amount,
          status: 'success',
          provider: 'razorpay',
          providerPaymentId: response.razorpay_payment_id,
          createdAt: new Date().toISOString(),
        });
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled before completion.')),
      },
    });
    checkout.open();
  });
};

export const demoPassword = 'password123';

export const demoUser = {
  name: 'Taylor Morgan',
  email: 'demo@prizebustershop.com',
  phone: '+880 1700 000 000',
  dateOfBirth: '1995-06-18',
};

export const orders = [
  {
    id: 'PB-2025-1048',
    date: '12 November 2025',
    total: 2020,
    status: 'On its way',
    items: ['Botanic herbal repair shampoo', 'Pure daily glow serum'],
    productIds: ['botanic-herbal-repair-shampoo', 'pure-daily-glow-serum'],
    estimatedArrival: '16–18 November',
    tracking: 'Your order is on its way. Estimated arrival: 16–18 November.',
  },
  {
    id: 'PB-2025-1041',
    date: '26 October 2025',
    total: 3490,
    status: 'Delivered',
    items: ['Sonora wireless headphones'],
    productIds: ['sonora-wireless-headphones'],
    tracking: 'Delivered successfully. We hope you love it.',
  },
  {
    id: 'PB-2025-1038',
    date: '01 October 2025',
    total: 1190,
    status: 'Delivered',
    items: ['Everyday ceramic vase'],
    productIds: ['everyday-ceramic-vase'],
    tracking: 'Delivered successfully. We hope you love it.',
  },
];

export const addresses = [
  {
    id: 'address-home',
    label: 'Home',
    recipient: 'Taylor Morgan',
    phone: '+880 1700 000 000',
    street: '24 Lakeview Road, Dhanmondi',
    city: 'Dhaka',
    postalCode: '1209',
    isDefault: true,
  },
  {
    id: 'address-work',
    label: 'Work',
    recipient: 'Taylor Morgan',
    phone: '+880 1700 000 000',
    street: 'Level 4, 18 Gulshan Avenue',
    city: 'Dhaka',
    postalCode: '1212',
    isDefault: false,
  },
];

export const preferences = {
  orderUpdates: true,
  offers: true,
  stories: false,
};

export const wishlistProductIds = [
  'botanic-herbal-repair-shampoo',
  'pure-daily-glow-serum',
  'everyday-ceramic-vase',
];

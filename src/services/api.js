import { products } from '../data/products';
import {
  addresses as demoAddresses,
  demoPassword,
  demoUser,
  orders as demoOrders,
  preferences as defaultPreferences,
  wishlistProductIds,
} from '../data/account';

const apiCache = new Map();
const apiUrl = import.meta.env.VITE_API_URL;
const PROFILE_KEY = 'price-buster-profile';
const ADDRESS_KEY = 'price-buster-addresses';
const PREFERENCES_KEY = 'price-buster-preferences';
const PASSWORD_KEY = 'price-buster-password-hash';
const WISHLIST_KEY = 'price-buster-wishlist';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const message = `Request failed: ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

function readLocal(key, fallback) {
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

function writeLocal(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

async function hashPassword(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function login(email, password) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  const profile = await getProfile();
  if (email.trim().toLowerCase() !== profile.email.toLowerCase() || !(await verifyPassword(password))) {
    throw new Error('Email or password is incorrect.');
  }

  return profile;
}

async function verifyPassword(password) {
  const savedHash = window.localStorage.getItem(PASSWORD_KEY);
  if (!savedHash) {
    if (password !== demoPassword) return false;
    window.localStorage.setItem(PASSWORD_KEY, await hashPassword(demoPassword));
    return true;
  }
  return (await hashPassword(password)) === savedHash;
}

export async function getProfile() {
  if (apiUrl) return fetchJson(`${apiUrl}/account/profile`);
  return readLocal(PROFILE_KEY, { ...demoUser });
}

export async function updateProfile(profile) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }
  return writeLocal(PROFILE_KEY, profile);
}

export async function updatePassword({ currentPassword, newPassword }) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  if (!(await verifyPassword(currentPassword))) {
    throw new Error('Your current password is incorrect.');
  }
  window.localStorage.setItem(PASSWORD_KEY, await hashPassword(newPassword));
  return { ok: true };
}

export async function getOrders() {
  if (apiUrl) return fetchJson(`${apiUrl}/account/orders`);
  return [...demoOrders];
}

export async function getAddresses() {
  if (apiUrl) return fetchJson(`${apiUrl}/account/addresses`);
  return readLocal(ADDRESS_KEY, demoAddresses.map((address) => ({ ...address })));
}

export async function saveAddress(address) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/addresses${address.id ? `/${address.id}` : ''}`, {
      method: address.id ? 'PUT' : 'POST',
      body: JSON.stringify(address),
    });
  }
  const current = await getAddresses();
  const savedAddress = address.id ? address : { ...address, id: `address-${Date.now()}` };
  const updated = address.id
    ? current.map((item) => (item.id === address.id ? savedAddress : item))
    : [...current, savedAddress];
  if (savedAddress.isDefault || !updated.some((item) => item.isDefault)) {
    return writeLocal(ADDRESS_KEY, updated.map((item) => ({ ...item, isDefault: item.id === savedAddress.id })));
  }
  return writeLocal(ADDRESS_KEY, updated);
}

export async function deleteAddress(id) {
  if (apiUrl) {
    await fetchJson(`${apiUrl}/account/addresses/${id}`, { method: 'DELETE' });
    return getAddresses();
  }
  const updated = (await getAddresses()).filter((address) => address.id !== id);
  if (!updated.some((address) => address.isDefault) && updated.length) updated[0].isDefault = true;
  return writeLocal(ADDRESS_KEY, updated);
}

export async function setDefaultAddress(id) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/addresses/${id}/default`, { method: 'PUT' });
  }
  return writeLocal(ADDRESS_KEY, (await getAddresses()).map((address) => ({ ...address, isDefault: address.id === id })));
}

export async function getPreferences() {
  if (apiUrl) return fetchJson(`${apiUrl}/account/preferences`);
  return readLocal(PREFERENCES_KEY, { ...defaultPreferences });
}

export async function savePreferences(preferences) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }
  return writeLocal(PREFERENCES_KEY, preferences);
}

export async function getWishlist() {
  if (apiUrl) {
    const response = await fetchJson(`${apiUrl}/account/wishlist`);
    return response.productIds || response;
  }
  return readLocal(WISHLIST_KEY, [...wishlistProductIds]);
}

export async function saveWishlist(productIds) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/account/wishlist`, {
      method: 'PUT',
      body: JSON.stringify({ productIds }),
    });
  }
  return writeLocal(WISHLIST_KEY, productIds);
}

async function getLocalProducts() {
  return [...products];
}

export async function getProducts() {
  if (apiCache.has('products')) {
    return apiCache.get('products');
  }

  const request = apiUrl
    ? fetchJson(`${apiUrl}/products`).catch(() => getLocalProducts())
    : getLocalProducts();

  const result = await request;
  apiCache.set('products', result);
  return result;
}

export async function getProduct(id) {
  const cacheKey = `product:${id}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const product = (await getProducts()).find((item) => item.id === id || item.slug === id);
  if (!product) {
    throw new Error('Product not found');
  }

  apiCache.set(cacheKey, product);
  return product;
}

export async function getRelatedProducts(id) {
  const product = await getProduct(id);
  const cacheKey = `related:${product.id}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const related = (await getProducts()).filter((item) =>
    product.relatedIds?.includes(item.id) || (product.category && item.category === product.category && item.id !== product.id),
  ).slice(0, 3);

  const result = related.length ? related : (await getProducts()).filter((item) => item.id !== product.id).slice(0, 3);
  apiCache.set(cacheKey, result);
  return result;
}

export async function getReviews(id) {
  const product = await getProduct(id);
  const cacheKey = `reviews:${product.id}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  apiCache.set(cacheKey, reviews);
  return reviews;
}

export async function submitReview(id, review) {
  const product = await getProduct(id);
  const nextReview = {
    name: review.name || 'Anonymous',
    title: review.title || 'Verified buyer',
    text: review.text || review.comment || '',
    rating: Number(review.rating) || 5,
    date: 'Just now',
  };

  const reviews = Array.isArray(product.reviews) ? [...product.reviews, nextReview] : [nextReview];
  product.reviews = reviews;
  product.reviewCount = reviews.length;
  product.rating = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length;

  apiCache.set(`reviews:${product.id}`, reviews);
  apiCache.set(`product:${product.id}`, product);
  return reviews;
}

export async function searchProducts(query = '') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return getProducts();
  }

  const allProducts = await getProducts();
  return allProducts.filter((product) => product.name.toLowerCase().includes(normalized));
}

export async function submitOrder(payload) {
  if (apiUrl) {
    return fetchJson(`${apiUrl}/orders`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  return {
    ok: true,
    orderId: `PB-${Date.now()}`,
    message: 'Order submitted locally',
  };
}

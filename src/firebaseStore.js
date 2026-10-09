import { onValue, ref, set } from 'firebase/database';
import { firebaseDatabase } from './firebaseClient';

function deserialize(value) {
  if (!value) return [];
  if (value.__empty === true) return [];
  return Array.isArray(value) ? value.filter(Boolean) : Object.values(value);
}

function serialize(items) {
  if (!items.length) return { __empty: true };
  return Object.fromEntries(items.map((item, index) => {
    const fallback = `record-${index}`;
    const key = String(item.id || fallback).replace(/[.#$\/\[\]]/g, '-');
    return [key, item];
  }));
}

function dispatch(name, detail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function createRealtimeCollection({ path, eventName, initialData = [], useInitialWhenEmpty = false }) {
  let cache = initialData;
  let stopListening = null;
  const subscribers = new Set();

  const publish = next => {
    cache = next;
    subscribers.forEach(callback => callback(next));
    dispatch(eventName, next);
  };

  const startListening = () => {
    if (stopListening || typeof window === 'undefined') return;
    stopListening = onValue(ref(firebaseDatabase, path), snapshot => {
      const next = snapshot.exists() ? deserialize(snapshot.val()) : useInitialWhenEmpty ? initialData : [];
      publish(next);
      dispatch('icon-academy-firebase-status', { connected: true });
    }, error => {
      dispatch('icon-academy-firebase-error', { message: error.message, code: error.code });
      dispatch('icon-academy-firebase-status', { connected: false });
    });
  };

  return {
    path,
    read: () => cache,
    subscribe(callback) {
      subscribers.add(callback);
      callback(cache);
      startListening();
      return () => {
        subscribers.delete(callback);
        if (!subscribers.size && stopListening) {
          stopListening();
          stopListening = null;
        }
      };
    },
    async write(items) {
      await set(ref(firebaseDatabase, path), serialize(items));
      publish(items);
      return items;
    },
  };
}

export function subscribeFirebaseConnection(callback) {
  if (typeof window === 'undefined') return () => {};
  return onValue(ref(firebaseDatabase, '.info/connected'), snapshot => callback(snapshot.val() === true));
}

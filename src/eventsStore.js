import eventManifest from './content/events.json';

export const eventsStorageKey = 'icon-academy-events-v1';
export const initialEvents = eventManifest;

export function readEvents() {
  if (typeof window === 'undefined') return initialEvents;
  try {
    const stored = window.localStorage.getItem(eventsStorageKey);
    return stored ? JSON.parse(stored) : initialEvents;
  } catch {
    return initialEvents;
  }
}

export function writeEvents(events) {
  window.localStorage.setItem(eventsStorageKey, JSON.stringify(events));
  window.dispatchEvent(new Event('icon-academy-events-updated'));
}

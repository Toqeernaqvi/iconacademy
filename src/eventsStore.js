import eventManifest from './content/events.json';
import { createRealtimeCollection } from './firebaseStore';

export const eventsStorageKey = 'icon-academy-events-v1';
export const initialEvents = eventManifest;
export const eventsFirebasePath = 'academy/public/events';

const eventsStore = createRealtimeCollection({
  path: eventsFirebasePath,
  eventName: 'icon-academy-events-updated',
  initialData: initialEvents,
  useInitialWhenEmpty: true,
});

export const readEvents = eventsStore.read;
export const subscribeEvents = eventsStore.subscribe;
export const writeEvents = eventsStore.write;

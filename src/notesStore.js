export const notesStorageKey = 'icon-academy-notes-v1';

import notesManifest from './content/notes.json';
import { createRealtimeCollection } from './firebaseStore';

export const initialNotes = notesManifest.map(note => ({ ...note, existingAsset: true }));
export const notesFirebasePath = 'academy/public/notes';

const notesStore = createRealtimeCollection({
  path: notesFirebasePath,
  eventName: 'icon-academy-notes-updated',
  initialData: initialNotes,
  useInitialWhenEmpty: true,
});

export const readNotes = notesStore.read;
export const subscribeNotes = notesStore.subscribe;
export const writeNotes = notesStore.write;

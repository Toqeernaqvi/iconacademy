export const notesStorageKey = 'icon-academy-notes-v1';

import notesManifest from './content/notes.json';

export const initialNotes = notesManifest.map(note => ({ ...note, existingAsset: true }));

export function readNotes() {
  if (typeof window === 'undefined') return initialNotes;
  try {
    const stored = window.localStorage.getItem(notesStorageKey);
    return stored ? JSON.parse(stored) : initialNotes;
  } catch {
    return initialNotes;
  }
}

export function writeNotes(notes) {
  window.localStorage.setItem(notesStorageKey, JSON.stringify(notes));
  window.dispatchEvent(new Event('icon-academy-notes-updated'));
}

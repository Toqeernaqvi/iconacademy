import { get, ref } from 'firebase/database';
import { firebaseDatabase } from './firebaseClient';
import { uploadDataUrl } from './firebaseFiles';
import { eventsFirebasePath, eventsStorageKey, initialEvents, writeEvents } from './eventsStore';
import { expensesFirebasePath, expensesStorageKey, initialExpenses, writeExpenses } from './expensesStore';
import { feesFirebasePath, feesStorageKey, initialFeeStudents, writeFeeStudents } from './feesStore';
import { initialNotes, notesFirebasePath, notesStorageKey, writeNotes } from './notesStore';
import { initialTeachers, teachersFirebasePath, teachersStorageKey, writeTeachers } from './teachersStore';

function readLegacy(key) {
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function safeName(value) {
  return String(value || 'record').replace(/[^a-zA-Z0-9._-]+/g, '-');
}

async function migrateEventFiles(events) {
  return Promise.all(events.map(async item => {
    if (!item.image?.startsWith('data:')) return item;
    const image = await uploadDataUrl(item.image, `events/${safeName(item.id)}-migrated.jpg`, 'image/jpeg');
    return { ...item, image };
  }));
}

async function migrateNoteFiles(notes) {
  return Promise.all(notes.map(async item => {
    const source = item.fileData || item.url;
    if (!source?.startsWith('data:')) {
      const { fileData, ...cleanItem } = item;
      return cleanItem;
    }
    const url = await uploadDataUrl(source, `notes/${safeName(item.id)}/migrated-${safeName(item.fileName || `${item.title}.pdf`)}`, 'application/pdf');
    const { fileData, ...cleanItem } = item;
    return { ...cleanItem, url, existingAsset: false };
  }));
}

async function migrateCollection({ path, storageKey, initialData, write, transform }) {
  const snapshot = await get(ref(firebaseDatabase, path));
  const legacy = readLegacy(storageKey);
  if (snapshot.exists()) {
    if (legacy) window.localStorage.removeItem(storageKey);
    return false;
  }

  let records = legacy || initialData;
  if (transform) records = await transform(records);
  if (records.length) await write(records);
  if (legacy) window.localStorage.removeItem(storageKey);
  return Boolean(legacy?.length);
}

export async function migrateLegacyAdminData() {
  const migrations = await Promise.all([
    migrateCollection({ path: eventsFirebasePath, storageKey: eventsStorageKey, initialData: initialEvents, write: writeEvents, transform: migrateEventFiles }),
    migrateCollection({ path: notesFirebasePath, storageKey: notesStorageKey, initialData: initialNotes, write: writeNotes, transform: migrateNoteFiles }),
    migrateCollection({ path: feesFirebasePath, storageKey: feesStorageKey, initialData: initialFeeStudents, write: writeFeeStudents }),
    migrateCollection({ path: teachersFirebasePath, storageKey: teachersStorageKey, initialData: initialTeachers, write: writeTeachers }),
    migrateCollection({ path: expensesFirebasePath, storageKey: expensesStorageKey, initialData: initialExpenses, write: writeExpenses }),
  ]);
  return migrations.some(Boolean);
}

import { get, ref, remove, set } from 'firebase/database';
import { firebaseDatabase } from './firebaseClient';

function safeKey(value) {
  return String(value || 'file').replace(/[.#$\[\]\/]+/g, '-');
}

function noteFileRef(noteId) {
  return ref(firebaseDatabase, `academy/public/noteFiles/${safeKey(noteId)}`);
}

export async function writeNoteFile(noteId, data, fileName) {
  await set(noteFileRef(noteId), { data, fileName });
}

export async function readNoteFile(noteId) {
  const snapshot = await get(noteFileRef(noteId));
  return snapshot.exists() ? snapshot.val()?.data || '' : '';
}

export async function deleteNoteFile(noteId) {
  await remove(noteFileRef(noteId));
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

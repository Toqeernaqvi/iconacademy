import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseStorage } from './firebaseClient';

function safeName(value) {
  return String(value || 'file').replace(/[^a-zA-Z0-9._-]+/g, '-');
}

export async function uploadEventImage(blob, eventId) {
  const fileRef = ref(firebaseStorage, `events/${safeName(eventId)}-${Date.now()}.jpg`);
  await uploadBytes(fileRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(fileRef);
}

export async function uploadNotePdf(file, noteId, fileName = file.name) {
  const fileRef = ref(firebaseStorage, `notes/${safeName(noteId)}/${Date.now()}-${safeName(fileName)}`);
  await uploadBytes(fileRef, file, { contentType: 'application/pdf' });
  return getDownloadURL(fileRef);
}

export async function uploadDataUrl(dataUrl, storagePath, contentType) {
  const blob = await fetch(dataUrl).then(response => response.blob());
  const fileRef = ref(firebaseStorage, storagePath);
  await uploadBytes(fileRef, blob, { contentType: contentType || blob.type });
  return getDownloadURL(fileRef);
}

export async function deleteFirebaseFile(url) {
  if (!url?.includes('firebasestorage.googleapis.com')) return;
  try {
    await deleteObject(ref(firebaseStorage, url));
  } catch {
    // Removing a record should not fail when an old uploaded file is already gone.
  }
}

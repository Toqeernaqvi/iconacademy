import teachersManifest from './content/teachers.json';

export const teachersStorageKey = 'icon-academy-teachers-v1';
export const initialTeachers = teachersManifest;

export function readTeachers() {
  if (typeof window === 'undefined') return initialTeachers;
  try {
    const stored = window.localStorage.getItem(teachersStorageKey);
    return stored ? JSON.parse(stored) : initialTeachers;
  } catch {
    return initialTeachers;
  }
}

export function writeTeachers(teachers) {
  window.localStorage.setItem(teachersStorageKey, JSON.stringify(teachers));
  window.dispatchEvent(new Event('icon-academy-teachers-updated'));
}

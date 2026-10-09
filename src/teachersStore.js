import teachersManifest from './content/teachers.json';
import { createRealtimeCollection } from './firebaseStore';

export const teachersStorageKey = 'icon-academy-teachers-v1';
export const initialTeachers = teachersManifest;
export const teachersFirebasePath = 'academy/admin/teachers';

const teachersStore = createRealtimeCollection({
  path: teachersFirebasePath,
  eventName: 'icon-academy-teachers-updated',
  initialData: initialTeachers,
});

export const readTeachers = teachersStore.read;
export const subscribeTeachers = teachersStore.subscribe;
export const writeTeachers = teachersStore.write;

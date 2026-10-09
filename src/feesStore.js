import feesManifest from './content/fees.json';
import { createRealtimeCollection } from './firebaseStore';

export const feesStorageKey = 'icon-academy-fees-v1';
export const feesFirebasePath = 'academy/admin/fees';
export const feeClassOptions = [
  { id: '9', label: 'Class 9' },
  { id: '10', label: 'Class 10' },
  { id: '11', label: 'Class 11' },
  { id: '12', label: 'Class 12' },
  { id: '10-supplementary', label: 'Class 10 Supplementary' },
  { id: '12-supplementary', label: 'Class 12 Supplementary' },
];

export const initialFeeStudents = feesManifest;

const feesStore = createRealtimeCollection({
  path: feesFirebasePath,
  eventName: 'icon-academy-fees-updated',
  initialData: initialFeeStudents,
});

export const readFeeStudents = feesStore.read;
export const subscribeFeeStudents = feesStore.subscribe;
export const writeFeeStudents = feesStore.write;

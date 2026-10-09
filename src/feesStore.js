import feesManifest from './content/fees.json';

export const feesStorageKey = 'icon-academy-fees-v1';
export const feeClassOptions = [
  { id: '9', label: 'Class 9' },
  { id: '10', label: 'Class 10' },
  { id: '11', label: 'Class 11' },
  { id: '12', label: 'Class 12' },
  { id: '10-supplementary', label: 'Class 10 Supplementary' },
  { id: '12-supplementary', label: 'Class 12 Supplementary' },
];

export const initialFeeStudents = feesManifest;

export function readFeeStudents() {
  if (typeof window === 'undefined') return initialFeeStudents;
  try {
    const stored = window.localStorage.getItem(feesStorageKey);
    return stored ? JSON.parse(stored) : initialFeeStudents;
  } catch {
    return initialFeeStudents;
  }
}

export function writeFeeStudents(students) {
  window.localStorage.setItem(feesStorageKey, JSON.stringify(students));
  window.dispatchEvent(new Event('icon-academy-fees-updated'));
}

import expensesManifest from './content/expenses.json';

export const expensesStorageKey = 'icon-academy-expenses-v1';
export const expenseCategories = [
  'Building rent',
  'Guard salary',
  'Aaya salary',
  'Generator petrol',
  'Electricity bill',
  'Internet bill',
  'Maintenance',
  'Miscellaneous',
];
export const initialExpenses = expensesManifest;

export function readExpenses() {
  if (typeof window === 'undefined') return initialExpenses;
  try {
    const stored = window.localStorage.getItem(expensesStorageKey);
    return stored ? JSON.parse(stored) : initialExpenses;
  } catch {
    return initialExpenses;
  }
}

export function writeExpenses(expenses) {
  window.localStorage.setItem(expensesStorageKey, JSON.stringify(expenses));
  window.dispatchEvent(new Event('icon-academy-expenses-updated'));
}

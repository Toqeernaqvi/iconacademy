import expensesManifest from './content/expenses.json';
import { createRealtimeCollection } from './firebaseStore';

export const expensesStorageKey = 'icon-academy-expenses-v1';
export const expensesFirebasePath = 'academy/admin/expenses';
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

const expensesStore = createRealtimeCollection({
  path: expensesFirebasePath,
  eventName: 'icon-academy-expenses-updated',
  initialData: initialExpenses,
});

export const readExpenses = expensesStore.read;
export const subscribeExpenses = expensesStore.subscribe;
export const writeExpenses = expensesStore.write;

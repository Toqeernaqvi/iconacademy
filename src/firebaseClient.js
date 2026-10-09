import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyADC_WJ46Q-kooUEw122dcQ5l4qOgHOTKc',
  authDomain: 'iconacademy-ddf56.firebaseapp.com',
  databaseURL: 'https://iconacademy-ddf56-default-rtdb.firebaseio.com',
  projectId: 'iconacademy-ddf56',
  storageBucket: 'iconacademy-ddf56.firebasestorage.app',
  messagingSenderId: '112443051204',
  appId: '1:112443051204:web:936e9eb98bfc745c1ccd91',
  measurementId: 'G-KMBY0LK7PK',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDatabase = getDatabase(firebaseApp);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-ignore (o TypeScript às vezes reclama dessa importação, mas funciona)
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCdanPC1bVAic7yaYA5bueDoLM1L7AgDpc',
  authDomain: 'contafacil-app-88e35.firebaseapp.com',
  projectId: 'contafacil-app-88e35',
  storageBucket: 'contafacil-app-88e35.firebasestorage.app',
  messagingSenderId: '183092062059',
  appId: '1:183092062059:web:d2b7522e3c27ed59834e2e',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth com "lembrar login" (guarda a sessão no celular)
let auth: Auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  auth = getAuth(app); // já foi iniciado (acontece ao salvar o código com o app aberto)
}

export { auth };
export const db = getFirestore(app);
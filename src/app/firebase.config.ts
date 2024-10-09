// src/app/firebase.config.ts

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
export const firebaseConfig = {
    apiKey: "AIzaSyCa2RWrqKQr-XB7o8XHsr8NOW9QPcfPImY",
    authDomain: "noticiaspwa-7291e.firebaseapp.com",
    projectId: "noticiaspwa-7291e",
    storageBucket: "noticiaspwa-7291e.appspot.com",
    messagingSenderId: "418353973914",
    appId: "1:418353973914:web:0dda3670b709fbae13ed23",
    measurementId: "G-D2K1CPQ3DZ"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Si vas a usar Analytics
export const analytics = getAnalytics(app);

// Si vas a usar autenticación
export const auth = getAuth(app);

// Si vas a usar Firestore
export const db = getFirestore(app);
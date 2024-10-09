// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { auth } from '../firebase.config'; // Importa la configuración
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Método para registrar un nuevo usuario
  registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Método para iniciar sesión
  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
}



/* PUES ERA ASI PERO CON FIREBASE PARECE QEU ES COO ARRIBA
import { Injectable } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();  // Se crea la instancia de auth
  private firestore = getFirestore();  // Se crea la instancia de Firestore

  constructor() {
    // Este método escucha el estado de autenticación del usuario.
    onAuthStateChanged(this.auth, user => {
      if (user) {
        console.log('Usuario logeado: ', user.displayName);
      } else {
        console.log('No hay usuario logeado.');
      }
    });
  }

  // Método para iniciar sesión con Google
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);  // Se utiliza el método modular
  }

  // Método para verificar si el usuario está logeado
  isUserLoggedIn() {
    const user = this.auth.currentUser;
    return user ? true : false;  // Devuelve true si el usuario está logeado
  }
} */

/*    METODO ANTIGUO PERO COMPATIBLE
// Usas la compatibilidad para seguir con el estilo de Firebase 8 y AngularFire
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Para usar Firebase Authentication
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Para usar Firestore

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  // Métodos para iniciar sesión con Google
  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
  */
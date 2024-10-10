import { Injectable } from '@angular/core';
import { auth } from '../firebase.config'; // Importa la instancia de autenticación de Firebase
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth'; // Importa funciones necesarias de Firebase Auth

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = null; // Variable para almacenar el usuario actual

  constructor() {
    // Inicia la escucha de cambios en el estado de autenticación al crear el servicio
    this.checkAuthState();
  }

  // Método para iniciar sesión con Google
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider(); // Crea una instancia del proveedor de autenticación de Google

    try {
      // Intenta iniciar sesión con una ventana emergente
      const result = await signInWithPopup(auth, provider);
      this.user = result.user; // Actualiza el estado del usuario con la información del usuario autenticado
      console.log('Usuario autenticado con Google:', this.user);
      return this.user;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error; // Propaga el error para que pueda ser manejado por el componente que llama a este método
    }
  }

  // Método para verificar y mantener el estado de autenticación
  checkAuthState() {
    // Establece un observador para cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user; // Actualiza el estado si hay un usuario autenticado
        console.log('Sesión activa:', this.user);
      } else {
        this.user = null; // Limpia el estado si no hay usuario autenticado
        console.log('No hay sesión activa');
      }
    });
  }

  // Método para cerrar sesión
  async signOut() {
    try {
      await auth.signOut(); // Cierra la sesión en Firebase
      this.user = null;  // Limpia el estado del usuario
      console.log('Usuario desconectado');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}

// Nota importante: La persistencia de la sesión se mantiene gracias al método checkAuthState().
// Este método utiliza onAuthStateChanged, que escucha continuamente los cambios en el estado de autenticación.
// Cuando el usuario inicia sesión, Firebase almacena el token de autenticación en el almacenamiento local del navegador.
// onAuthStateChanged detecta este token almacenado, permitiendo que la sesión persista incluso al cambiar de ventana o recargar la página.



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
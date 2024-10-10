import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';  // Importa el servicio de autenticación

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage {

  user: any = null; // Variable para almacenar la información del usuario

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // Inicializa el estado del usuario al cargar el componente
    this.user = this.authService.user;
  }

  // Método para iniciar sesión con Google
  async loginWithGoogle() {
    try {
      this.user = await this.authService.signInWithGoogle(); // Llama al método de inicio de sesión del servicio
      console.log('Usuario logueado:', this.user);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }

  // Método para cerrar sesión
  async logout() {
    try {
      await this.authService.signOut(); // Llama al método de cierre de sesión del servicio
      this.user = null;  // Limpia la información del usuario en el componente
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}

// Nota: Este componente utiliza el AuthService para manejar la lógica de autenticación.
// La persistencia de la sesión se maneja en el servicio, por lo que este componente
// solo necesita reflejar el estado actual del usuario, que se actualiza automáticamente
// gracias al observable establecido en AuthService.checkAuthState().
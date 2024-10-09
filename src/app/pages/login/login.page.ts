import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';  // Importa el servicio de autenticación
import { Router } from '@angular/router';  // Importa Router para redirigir al usuario después de iniciar sesión

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage {

  constructor(private authService: AuthService, private router: Router) { }

  // Método para iniciar sesión con Google
  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/tabs/tab1']);  // Redirige al usuario a la pantalla principal después de iniciar sesión
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }
}
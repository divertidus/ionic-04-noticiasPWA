import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

// Configuración de almacenamiento


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, // Configuración de RouteReuseStrategy
    provideIonicAngular(), // Configuración de Ionic Angular
    provideRouter(routes, withPreloading(PreloadAllModules)), // Configuración del router
    provideHttpClient(), // Configuración del HttpClient
    importProvidersFrom(IonicStorageModule.forRoot()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), // Configuración del almacenamiento local
  ],
}).catch((err) => console.error(err));
/*
Guía Esencial: Servicio API en Ionic 8 con Componentes Standalone
Pasos 100% Necesarios

-------------------Configurar HttpClient en main.ts-----------------------
typescriptCopyimport { bootstrapApplication } from '@angular/platform-browser';
                                                            import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
                                                            provideHttpClient(),
  ]
}).catch(err => console.error(err));




-----------------Crear el Servicio API----------------
typescriptCopy// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get('https://api.example.com/data');
  }
}

---------------------Usar el Servicio en un Componente-------------------
typescriptCopy// home.page.ts
import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage {
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe(data => {
      console.log(data);
    });
  }
}


-------------------------Información Adicional (No Esencial)

El providedIn: 'root' en el servicio lo hace disponible en toda la aplicación sin necesidad de declararlo en un módulo.
Si necesitas providers globales adicionales, puedes agregarlos en el array providers en main.ts.
Los componentes standalone requieren importar directamente los módulos que usan (como IonicModule y CommonModule).
No es necesario un archivo app.module.ts en esta configuración.
*/
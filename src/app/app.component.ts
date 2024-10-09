import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as ionIcons from 'ionicons/icons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonIcon,],
})
export class AppComponent {
  constructor() { }
}

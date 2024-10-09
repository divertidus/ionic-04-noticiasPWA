import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonSegmentButton, IonLabel, IonSegment } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { StorageService } from 'src/app/services/storage.service';
import { Article } from 'src/app/interfaces';
import { ArticlesComponent } from "../../components/articles/articles.component";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonSegment, IonLabel, IonSegmentButton, IonInfiniteScrollContent, IonInfiniteScroll, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, ArticlesComponent],
})
export class Tab3Page {

  /* AUNQUE DEBAJO HAY OTRA FORMA, ESTA ES SUPERSENCILLA. AL HACER EL get metodo PUED0O ASIGNAR DIRECTAMENTE SU NOMBRE EN EL HTML
  ACTUA A LA VEZ DE METODO Y DE VARIABLE. ADEMAS AL SER UN GET ANGULAR LO REFRESCA AUTOMATICAMNETE, DE MODO QUE SI QUITO O AÑADO FAVORITOS YA SE APLICAN LOS CAMBIOS
  NATURALMENTE TAMBIEAN HAY COSITAS EN EL STORAGESERVICE
  LO MAS IMPORTANTE EL loadFvourites en el init de dicho servicio, isno no se ve al refrescar la pagina en tab3*/


  constructor(private storageService: StorageService) {
  }

  /*Los getter gracias a Angular mantienen monitorizados los objetos y reflejan sus cambios*/
  get articulosFavoritos(): Article[] {
    return this.storageService.getLocalArticles();
  }



  /* ESTA FORMA FUNCIONA CON VARIABLE PARA LAS NOTICIAS PERO LO HAREMOS DE OTRA MANERA
   constructor(private storageService: StorageService) {
  }

  public noticiasEnFavoritos: Article[] = [];

  async ngOnInit(): Promise<void> {
    // Cargar los artículos favoritos desde el almacenamiento local
    // Asignar los artículos cargados a la variable `noticiasEnFavoritos`
    await this.storageService.init()
    this.noticiasEnFavoritos = await this.storageService.loadFavoritos();
  }
  */

}

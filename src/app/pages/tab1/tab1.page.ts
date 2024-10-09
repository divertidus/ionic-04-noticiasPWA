import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonLabel, IonItem, IonCard, IonCardSubtitle,
  IonCardTitle, IonCardHeader, IonCardContent, IonGrid, IonRow, IonCol, IonImg, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { NewsService } from 'src/app/services/news.service';
//como hemos nombrado el archivo index.ts será el que tome por defecto si no establecemos nada mas
import { Article, NewsResponse } from 'src/app/interfaces';
import { NgFor, NgIf } from '@angular/common';
import { ArticlesComponent } from "../../components/articles/articles.component";



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonImg, IonCol, IonRow, IonGrid, IonCardContent, IonCardHeader, IonCardTitle, NgIf, IonCardSubtitle, IonCard, IonItem, IonLabel,
    IonList, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, NgFor, ArticlesComponent],
})
export class Tab1Page implements OnInit {
  // le decimos que implemente onInit para implementar y usar ngOnInit

  /*  Vamos a usar nuestro servicio news asi que tenemos que inyectarlo en el constructor
  Luego lo usaremos en el ngOnInit que como no aparece demos implementar OnInit en la clase
  */
  constructor(private newsService: NewsService) { }

  //Creo una variable llamada arrayArticulos que será un array de Article y por defecto  será un array vacío.
  public arrayArticulos: Article[] = []

  ngOnInit(): void {

    /*De nuestro servicio newsService, llamamos al metood getTopHeadLines() , nos suscribimos 
    y la respuesta la mandamos por consola.
    */
    /*this.arrayNoticias = this.newsService.getTopHeadLines().subscribe;
    console.log(this.arrayNoticias)*/

    /*Llamo al metodo del servicio, recordemos que devuelve un observable
   Por tanto nos suscribimos al observable y su respuesta. */
    /*Podríamos decirle que respuesta es del tipo que creamos en la interfaz NewsResponse
   
        .subscribe((respuesta: NewsResponse) => {
     
         Pero previamente hemos establecido en el servicio que el dato que devuelve nuestro metodo es NewsResponse
         De modo que si dejamos el raton encima del "respuesta" que está en el .subscribe(respuesta) veremos que ya es de ese tipo
         return this.http.get<NewsResponse>(`https://newsa..... 
       */
    this.newsService.getTopHeadLinesByCategory('business')
      .subscribe(articles => {
        this.arrayArticulos.push(...articles) // le digo que en el arrayArticulos meta .(.push) la desestructuracion "..." de los articulos(...articles)
        console.log(articles) // La sacamos por consola
      });

  }

  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll!: IonInfiniteScroll

  loadData() {

    this.newsService.getTopHeadLinesByCategory('business', true)
      .subscribe(articulos => {

        if (articulos.length === this.arrayArticulos.length) {
          console.log("El ultimo articulo recibido y el guardado son el mismo. No hay mas")
          this.infiniteScroll.disabled = true;
          return;
        }

        this.infiniteScroll.disabled = false;
        this.infiniteScroll.complete();
        this.arrayArticulos = articulos;
      });
    console.log("ahora cargo, tras terminas el timeout")

  }


}

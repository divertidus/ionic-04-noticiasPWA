import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Browser } from '@capacitor/browser';
import {
  IonGrid, IonRow, IonCardSubtitle,
  IonCol, IonCard, IonCardTitle, IonImg,
  IonCardContent, IonButton, IonIcon, IonActionSheet
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import * as ionIcons from 'ionicons/icons';
import { Article } from 'src/app/interfaces';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core'; // Importa Capacitor
import { StorageService } from 'src/app/services/storage.service';
import { ActionSheetController } from '@ionic/angular'; //Esto para poder manejar mejor el actionSheet


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: true,
  imports: [IonActionSheet, IonIcon, IonButton, IonGrid, IonRow,
    IonCardSubtitle, IonCol, IonCard, IonCardTitle, IonImg, IonCardContent, NgFor, NgIf],
  providers: [Input]
})
export class ArticleComponent implements OnInit {

  @ViewChild(IonActionSheet) actionSheet!: IonActionSheet; //SOLUCION MAS COMODA

  @Input() articulo!: Article;
  @Input() indiceArticulo: number = 0;


  constructor(
    private storageService: StorageService,
    private actionSheetCtrl: ActionSheetController
  ) {
    addIcons(ionIcons);
  }

  ngOnInit() { }

  /*
  En vez del trigger, es más sencillo y da menos problemas usar el viewmodel y un medoto que presente el actionsheet.
  Asi no sucede el problema de que en una pagina funciona el action sheet pero en otra página no funcionan aquellos que ya 
  se habian cargado previamente desde la primera. Asi todo perfecto.
  */
  /*presentActionSheet() {  //SOLUCION MAS COMODA
    this.actionSheet.present();
  }*/

  mostrarIndice() {
    console.log(this.indiceArticulo)
    console.log(this.articulo.title)
  }






  /* Por si quiero restringir si compartir aparece o no puedo hacerlo así. De todos modos 
  lo comento porque en el navegador no parece haber capacitor aunque el botón funciona de igual forma.

  Sin embargo el navagador no me considera que sea capacitor 
  aunque me permita usar la opcion asi que temporalmente no usaremos lo siguiente
  */

  /*
  public actionSheetButtons = Capacitor.isNativePlatform() ? [ // En caso de que corra en  dispositivo con capacitor
    {
      text: "Compartir",
      icon: "share-outline",
      data: {},
      handler: () => this.accionHandler('compartir')
    },
    {
      text: "Favorito",
      icon: "heart-outline",
      data: {},
      handler: () => this.accionHandler('favorito')
    },
    {
      text: "Cancelar",
      icon: "close-outline",
      role: "cancel",
      data: {},
      handler: () => this.accionHandler('cancelar')
    }
  ] : [ // En caso de que NO corra en  dispositivo con capacitor, no añade el boton de compartir
    {
      text: "Favorito",
      icon: "heart-outline",
      data: {},
      handler: () => this.accionHandler('favorito')
    },
    {
      text: "Cancelar",
      icon: "close-outline",
      role: "cancel",
      data: {},
      handler: () => this.accionHandler('cancelar')
    }
  ];

  */

  /*Dado que voy a usar otra forma de implementar los botones comentaré esto. Usaré un método para que los mismos se generen al hacer click
  y abrir el menu de botones, no que precargue todos antes. Supong que mejora el rendimiento, pero así puedo tener más control
  para variar el boton si esta o no en favorito un articulo ya que podré crear una propiedad para comprobarlo al ir a darle y no antes.
  */

  /*
    public actionSheetButtons = [ // En caso de que corra en  dispositivo con capacitor
      {
        text: "Compartir",
        icon: "share-outline",
        data: {},
        handler: () => this.accionHandler('compartir')
      },
      {
        text: this.storageService.articuloEnFavoritos(this.articulo) ? "Quitar de favoritos" : "Favorito",  // Cambia el texto basado en si está o no en favoritos
        icon: this.storageService.articuloEnFavoritos(this.articulo) ? "heart" : "heart-outline",  // Cambia el icono basado en si está o no en favoritos
        data: {},
        handler: () => this.accionHandler('favorito')
      },
      {
        text: "Cancelar",
        icon: "close-outline",
        role: "cancel",
        data: {},
        handler: () => this.accionHandler('cancelar')
      }
    ];
    */
  backdropVisible = false;
  async abrirMenuOpcionesActionSheet() {

    const esFavorito = this.storageService.articuloEnFavoritos(this.articulo)
    this.backdropVisible = true;
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Acciones',

      buttons: [ // En caso de que corra en  dispositivo con capacitor
        {
          text: "Compartir",
          icon: "share-outline",
          data: {},
          handler: () => this.accionHandler('compartir')
        },
        {
          text: esFavorito ? "Quitar de favoritos" : "Favorito",  // Cambia el texto basado en si está o no en favoritos
          icon: esFavorito ? "heart" : "heart-outline",  // Cambia el icono basado en si está o no en favoritos
          data: {},
          handler: () => this.accionHandler('favorito')
        },
        {

          text: "Cancelar",
          icon: "close-outline",
          role: "cancel",
          data: {},
          handler: () => this.accionHandler('cancelar'),
        }
      ]

    });
    await actionSheet.present();

  }



  /*OTRA OPCION PARA NO DUPLICAR EL CODIGO DE LOS BOTONES SERÍA HACERLE UN PUSH AL ARRAY DE BOTONES, DEJO EJEMPLO DEBAJO:

  public actionSheetButtons: any[] = [];

  ngOnInit() {
    this.setupActionSheetButtons();
  }

  setupActionSheetButtons() {
    // Botones comunes para todas las plataformas
    this.actionSheetButtons = [
      {
        text: "Favorito",
        icon: "heart-outline",
        data: {},
        handler: () => this.accionHandler('favorito')
      },
      {
        text: "Cancelar",
        icon: "close-outline",
        role: "cancel",
        data: {},
        handler: () => this.accionHandler('cancelar')
      }
    ];

    // Agregar el botón de compartir solo si es una plataforma nativa
    if (Capacitor.isNativePlatform()) {
      this.actionSheetButtons.unshift({
        text: "Compartir",
        icon: "share-outline",
        data: {},
        handler: () => this.accionHandler('compartir')
      });
    }
  }
  
  
  */

  async onClick() {
    await Browser.open({ url: this.articulo.url })
  }

  accionHandler(opcion: string) {

    switch (opcion) {
      case "compartir":
        console.log("Se pulsa compartir");
        this.compartirNoticia();
        break;

      case "favorito":
        console.log("Se pulsa favorito/quitar de favorito");
        this.onToogleFavorite();
        break;

      case "cancelar":
        console.log("Se pulsa cancelar");
        break;
    }
  }


  async compartirNoticia() {

    // Share url only
    /*await Share.share({
      url: this.articulo.url,
    });*/

    await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: this.articulo.url,
      dialogTitle: 'Share with buddies',
    });

  }

  onToogleFavorite() {
    this.storageService.saveRemoveArticle(this.articulo);
  }


}


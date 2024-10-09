import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';
import { auth } from '../firebase.config'; // Importa la configuración


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.init();
  }

  /* la barra baja es convención para indicar que es privado, pero se consigue realmente por el private nada mas.*/
  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavoritos();
    console.log("Ionic Storage inicializado: ", storage);

  }

  /* ESTO VIENE EN LA AYUDA PERO NO LO VAMOS A IMPLEMENTAR AHORA 

  
  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
    */


  /*  La idea es que, si no existe un articulo ya guardado, se guarde, y si existe, se borre.
  Se crea constante que buscará en _localArticles mediante el find si : 
  (asigno un nombre localArticle,vale cualquiera pero asi sabemos que estamo comparando un articulo guardado en local)
  si por cada localArticle, se comprueba si el titulo de ese local article es igual que el titulo del articulo recibido.
  */
  async saveRemoveArticle(articuloRecibido: Article) {

    // Asi buscamos y guardamos el articulo en exists si es que existe (se comparará con if (exists))
    const exists = this._localArticles.find(localArticle => localArticle.title === articuloRecibido.title)
    // Asi buscamos y guardamos el indice del articulo si es que existe (se comparará con if (index !== -1) {)
    const indiceEncontrado = this._localArticles.findIndex(localArticle => localArticle.title === articuloRecibido.title)

    /*ATENCION, "exists" NO ES UN BOOLEAN. 
    SI EXISTE GUARDA EL ARTICULO Y SINO NO. CON DOBLE EXCLAMACION SE CONVIERTE A BOOLEAN
    Al comprobar  "if (exists)"" se está comprobando si tiene algun valor, 
    lo cual ya nos sirve como true y a la vez ya tenemos dicho valor. Pero no tiene un true o un false.
    Si tiene algo significa que en realidad queremos borrar porque ya existe.
    Para esto hay dos formas, 
      A. - o filtramos la lista de noticias para excluirla -> Por eso arriba el uso de exists indiceEncontrado
      B. - o obtenemos el índice y se usa splice -> Por eso arriba el uso de const indiceEncontrado    
    En ambos casos luego habrá que volver a guardar en el storage this._localArticles tras su modificacion
    
    */

    /*Forma A*/
    if (exists) {
      console.log("Se ve que ya existia. A borrar usando filter")
      // Hacemos que la lista sea igual a la lista tras filtrar por el titulo del articulo que existe. Es como eliminarlo...
      this._localArticles = this._localArticles.filter(localArticle => localArticle.title !== articuloRecibido.title)

      /*Forma B*/
      /*
      if (indiceEncontrado !== -1) {
        console.log("El artículo ya existía. Eliminándolo con slice");
        this._localArticles.splice(indiceEncontrado, 1);
      }
        */

      // Guardamos la lista actualizada en el storage
      await this._storage?.set('articles', this._localArticles);

      // Comprobación por consola
      console.log("Artículo eliminado: ", this._localArticles);

    } else {

      //Esto es: mi array de articulos será igual al articulo recibido +  los articulos que ya tenia.
      //Lo podría poner en orden inverso [...this._localArticles,articuloRecibido,] pero asi tengo "primero el nuevo".
      this._localArticles = [articuloRecibido, ...this._localArticles]

      //Uso mi storage para grabar ( set) una key que se llame articulos, y en ella guardo todo el array de articulos.
      //No necesito serializar ni convertir a String ni nada porque el Storage ya graba objetos
      await this._storage?.set('articles', this._localArticles)

      //Comprobación por consola
      console.log("Artículo guardado: ", this._localArticles);
    }

  }

  getLocalArticles() {
    return [...this._localArticles];
  }

  async getLocalArticles2() {
    if (!this._storage) {
      await this.init();
    }
    const savedArticles = await this._storage?.get('articles');
    this._localArticles = savedArticles || [];
    return this._localArticles;
  }

  async loadFavoritos() {
    try {
      const articulosFavoritos = await this._storage?.get('articles') //Recordamos que el 'articles' es la key.
      //No deberia, pero si fuese null cargaremos un array vacio. Por eso:  this._localArticles = articulosFavoritos || [];
      this._localArticles = articulosFavoritos || [];
      return this._localArticles;
    }
    catch {
      console.log("No hay favoritos. Se devuelve array vacío")
      return [];
    }
  }

  /*Metodo para saber si un articulo está o no en favoritos
  Debe regresar un boolean así que con !! lo convertimos*/
  articuloEnFavoritos(articulo: Article) {
    if (!articulo || !articulo.title) {
      console.log("articuloEnFavoritos estaria false" + articulo)
      return false;  // Si el artículo no está definido o no tiene un 'title', retorna false
    }
    console.log("articuloEnFavoritos estaria true")
    return !!this._localArticles.find(localArticle => localArticle.title === articulo.title);
  }

}

/* Probaremos esto primero ( v22) en el article.ts */


/*     --> SOLUCION AQUI !! 
https://forum.ionicframework.com/t/ionicstorage-for-angular-in-ionic-7/232596/5
*/

/*ENLACES CON LA AYUDA pero no funcionaron...:

https://ionicframework.com/docs/angular/storage

QUE LLEVA A:

https://github.com/ionic-team/ionic-storage
*/
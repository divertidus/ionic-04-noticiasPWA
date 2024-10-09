import { HttpClient } from '@angular/common/http'; // Importamos HttpClient para hacer peticiones HTTP
import { Injectable } from '@angular/core'; // Decorador para servicios inyectables
import { environment } from 'src/environments/environment'; // Importamos variables de entorno
import { Observable, of } from 'rxjs'; // Para trabajar con flujos de datos asíncronos
import { Article, ArticulosPorCategoriaYPagina, NewsResponse } from '../interfaces'; // Importamos interfaces personalizadas
import { map } from 'rxjs/operators'; // Operador para transformar datos en un Observable


// Extraemos apiKey y apiUrl de las variables de entorno
const apiKey = environment.apiKey;
const apiUrl = environment.apiURL;

/* De esta forma no pondremos nuestra apiKey directamente en cada una de las peticiones http que hagamos.
Sino que iremos cogiendo el valor del archivo environment donde la hemos definido. */

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class NewsService {
  
  // Constructor del servicio, inyectamos HttpClient
  constructor(private http: HttpClient) { }

  /* Método genérico para ejecutar consultas HTTP
     T es un tipo genérico que se especificará cuando se llame al método
     endpoint es la parte final de la URL que varía según la consulta */
  private executeQuery<T>(endpoint: string) {
    console.log('Peticion HTTP realizada desde executeQuery');
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apiKey: apiKey, // Añadimos la apiKey como parámetro
        country: 'us', // Configuramos el país para las noticias
      }
    })
  }

  /* Objeto para almacenar artículos por categoría y página
     Esto evita hacer peticiones HTTP repetidas para información ya obtenida */
  private articulosPorCategoriaYPagina: ArticulosPorCategoriaYPagina = {}

  

  // Método para obtener los titulares principales, que sera de business siempre
  getTopHeadLines(): Observable<Article[]> {
    console.log("Peticion http realizada sin categoria que llamo al ExecuteQuery")
    return this.executeQuery<NewsResponse>(`/top-headlines?category=business`).pipe(
      map(({ articles }) => articles) // Extraemos solo el array de artículos de la respuesta
    );
  }
  /*
    // Método para obtener los titulares principales, sin categoria
    getTopHeadLines(): Observable<Article[]> {
      console.log("Peticion http realizada sin categoria que llamo al ExecuteQuery")
      return this.executeQuery<NewsResponse>(`/top-headlines?`).pipe(
        map(({ articles }) => articles) // Extraemos solo el array de artículos de la respuesta
      );
    }
  */

  // Método para obtener titulares por categoría
  // Aqui debemos pensar lo siguiente:
  // Si estamos a una categoria por "primera vez" o necesitamos más datos, debemos cargarlos desde la api
  // Pero si solo estamos cambiando de categoría entre las que ya estaban cargadas, no. Ahi debo cargar lo que está en memoria.
  //Por eso antes añadimos el cargarMas boolean, vamos a usarlo.
  getTopHeadLinesByCategory(category: string, cargarMas: boolean = false): Observable<Article[]> {

    // SI QUIERE CARGAR MÁS ARTICULOS:
    if (cargarMas) {
      // llamamos al nuevo metodo que estuvimoshaciendo más abajo pasándole la categoría.
      // podría hacer un  -- return this.getArticulosPorCategoria(category) --
      // pero ese método me devuelve solo los de la página que sea y lo que queremos es todos 
      /*      PARA EJEMPLIFICARLO ESTE ES EL BLOQUE FINAL DEL METODO DE ABAJO ANTES DE CAMBIARLO
      if (articles.length === 0) return [];
          this.articulosPorCategoriaYPagina[category] = { 
            pagina: page,           
  ESTOS SON LOS QUE QUIERO--->  articulos: [...this.articulosPorCategoriaYPagina[category].articulos, ...articles]
  YA QUE INCLUYEN LOS ANTERIORES Y LOS NUEVOS

          }
          return articles; -> LO QUE DEVUELVE SON LOS ARTICULOS DE LA PAGINA QUE CORRESPONDA

          if (articles.length === 0) return [];
          this.articulosPorCategoriaYPagina[category] = { 
            pagina: page,          
            articulos: [...this.articulosPorCategoriaYPagina[category].articulos, ...articles]

          }
          return this.articulosPorCategoriaYPagina[category].articulos; -->Devuelvo esto otro y listo
      */
      return this.getArticulosPorCategoria(category) // tras los cambios ya podemos hacer aqui el return
    }

    /* SI NO QUIERE CARGAR MÁS ARTICULOS puedes ser que no existan o que quiere cargar los que están en memoria
     Primero comprobemos si hay en memoria comprobando si lo siguiente existe.
     y si existe devolvemos sus articulos. Pero se espera un Observable, hay que arreglarlo.
     Aunque habría más opciones, darían problemas ya que en nuetro codigo usamos los observables y sus metodos
     Entonces usaremos una funciona de rxjs llamada "of". La importamos import { Observable,of } from 'rxjs'; */

    if (this.articulosPorCategoriaYPagina[category]) {
      //  return this.articulosPorCategoriaYPagina[category].articulos; // ->Error por no ser observable.
      return of(this.articulosPorCategoriaYPagina[category].articulos);
    } //  -> Arreglado

    // Y SI NO EXISTE UNA CATEGORIA AHI HAREMOS LA MISMA FUNCION QUE SI QUISIESE CARGAR MAS Y ALLI COMPROBARA
    console.log("Peticion http realizada por categoria que llamó al executeQuery")
    return this.getArticulosPorCategoria(category)

    console.log("Peticion http realizada por categoria que llamó al executeQuery")
    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}`).pipe(
      map(({ articles }) => articles) // Extraemos solo el array de artículos de la respuesta
    );
  }

  /* Método privado para obtener artículos por categoría, gestionando la paginación */
  private getArticulosPorCategoria(category: string): Observable<Article[]> {
    // Comprobamos si ya existe la categoría en nuestro objeto
    if (Object.keys(this.articulosPorCategoriaYPagina).includes(category)) {
      // Si existe, no hace nada
      // Esto es equivalente a: if(this.articulosPorCategoriaYPagina[category])
    } else {
      // Si no existe, la crea con valores iniciales
      this.articulosPorCategoriaYPagina[category] = {
        pagina: 0,
        articulos: []
      }
    }

    // Incrementamos el número de página para la siguiente petición
    const page = this.articulosPorCategoriaYPagina[category].pagina + 1;

    // v0.14 -> Modificamos como devuelve el map ANTES:  map(({ articles }) => articles) 

    // Realizamos la petición HTTP para la categoría y página específicas


    return this.executeQuery<NewsResponse>(`/top-headlines?country=us&category=${category}&page=${page}`)
      .pipe(
        map(({ articles }) => {  // Para este punto sabemos cual es la pagina, la categoria y tenemos los artículos
          // Lo que tenemos que hacer es actualizar el objeto articulosPorCategoriaYPagina

          //if (articles.length === 0) return []; --> Si no hay más que traer no quiero devolver vacio 
          // --> Si no hay mas quiero lo que ya había y eso lo hago como abajo, con this.articulosPorCategoriaYPagina[category].articulos;
          if (articles.length === 0) {
            console.log("No hay más que mostrar")
            return this.articulosPorCategoriaYPagina[category].articulos;
          }
          this.articulosPorCategoriaYPagina[category] = { // esto, basado en la categoria será igual al objeto
            pagina: page,   // cuya pagina será page
            //y cuyos articulos serán los de articles que estoy colocando aqui.
            //Sin embargo queremos manter los anteriores... y si llegamos a la ultima pagina 
            // llegará un array vacio. Entonces previamente ( mas arriba ) haremos 
            //  if(articles.length === 0) return []; Si no hay articulos devuelve array vacio
            // articulos: articles // pero con esto no añadiria 
            // para ello hacemos  lo siguiente, ... es desestructurar el array. Cojo lo que tengo y le añado los articles.
            articulos: [...this.articulosPorCategoriaYPagina[category].articulos, ...articles]



          }
          //return articles; //Con esto solo devuelvo los de la pagina que sea

          return this.articulosPorCategoriaYPagina[category].articulos; // Con esto devuelvo los de la pagina + anteriores
        })
      );
  }
}

// Código eliminado y comentarios antiguos:

/*
Método antiguo del getTopHeadLines:

getTopHeadLines(): Observable<Article[]> {
  console.log("Peticion http realizada sin categoria")
  return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business`, {
    params: { apiKey: apiKey }
  }).pipe(
    map(({ articles }) => articles)
  );
}

Método antiguo del getTopHeadLinesByCategory:

getTopHeadLinesByCategory(category: string, cargarMas: boolean = false): Observable<Article[]> {
  console.log("Peticion http realizada por categoria")
  return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}`, {
    params: { apiKey: apiKey, }
  }).pipe(
    map(({ articles }) => articles)
  );
}

Antiguo método de getArticulosPorCategoria:

return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}`, {
  params: { apiKey: apiKey, }
}).pipe(
  map(({ articles }) => articles)
);

Comentarios sobre la desestructuración en el map:
Aquí, como si ponemos el ratón encima de respuesta nos dice que es de tipo NewsResponse, y en la interfaz ya definimos que ese tipo
contiene "articles". Podemos en vez de poner map(respuesta => respuesta.articles)) 
poner map(({ articles }) => articles) 
Lo que hacemos es desestructurar los artículos de ese objeto directamente. Cualquiera vale.
*/
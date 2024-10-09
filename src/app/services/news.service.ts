import { HttpClient } from '@angular/common/http'; // Importamos HttpClient para hacer peticiones HTTP
import { Injectable } from '@angular/core'; // Decorador para servicios inyectables
import { environment } from 'src/environments/environment'; // Importamos variables de entorno
import { Observable, of } from 'rxjs'; // Para trabajar con flujos de datos asíncronos
import { Article, ArticulosPorCategoriaYPagina, NewsResponse } from '../interfaces'; // Importamos interfaces personalizadas
import { map } from 'rxjs/operators'; // Operador para transformar datos en un Observable
import { storedArticlesByCategory } from '../data/mock-news';



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

  // Información local, que simula la respuesta de la API
  private articulosPorCategoriaYPagina: ArticulosPorCategoriaYPagina | any = storedArticlesByCategory;

  // Método para obtener los titulares principales, que será de business siempre
  getTopHeadLines(): Observable<Article[]> {
    console.log("Devolviendo datos locales para los titulares principales (business)");

    // Devuelve los artículos directamente desde la información local
    return of(this.articulosPorCategoriaYPagina['business'].articulos);
  }

  getTopHeadLinesByCategory(category: string, cargarMas: boolean = false): Observable<Article[]> {
    console.log(`Devolviendo datos locales para la categoría: ${category}`);

    if (cargarMas) {
      return this.getArticulosPorCategoria(category);
    }

    if (this.articulosPorCategoriaYPagina[category]) {
      return of(this.articulosPorCategoriaYPagina[category].articulos);
    } else {
      console.log(`No existen artículos locales para la categoría ${category}`);
      return of([]);  // Si no existe la categoría, devuelve un array vacío
    }
  }

  /* Método privado para obtener artículos por categoría, gestionando la paginación */
  private getArticulosPorCategoria(category: string): Observable<Article[]> {
    // Comprobamos si ya existe la categoría en nuestro objeto
    if (!this.articulosPorCategoriaYPagina[category]) {
      // Si no existe, la creamos con valores iniciales
      console.log(`Creando nueva categoría en los datos locales para: ${category}`);
      this.articulosPorCategoriaYPagina[category] = {
        pagina: 0,
        articulos: []  // Inicializamos la lista de artículos vacía
      };
    }

    // Incrementamos el número de página para la siguiente "petición"
    const page = this.articulosPorCategoriaYPagina[category].pagina + 1;

    // Actualizamos la categoría con los artículos obtenidos en la "paginación"
    this.articulosPorCategoriaYPagina[category] = {
      pagina: page,  // Asignamos la nueva página
      articulos: [...this.articulosPorCategoriaYPagina[category].articulos, ...this.articulosPorCategoriaYPagina[category].articulos]
    };

    return of(this.articulosPorCategoriaYPagina[category].articulos);
  }
}
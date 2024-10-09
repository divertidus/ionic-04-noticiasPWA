//He generado esto mediante : https://app.quicktype.io/

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

export interface Article {
    source: Source;
    author?: string;
    title: string;
    description?: string;
    url: string;
    urlToImage?: string;
    publishedAt: Date;
    content?: string;
}

export interface Source {
    id?: string;
    name: string;
}

/*
Ahora que tenemos una interfaz podemos importarla 
en nuestra tab1 y usarla alli diciendo que la respuesta es de tiepo NewsResponse
*/

/* Interfaz para no realizar tantas consutas http, esto va ligado a v13, en concreto para:

private articlesByCategory = {
    business: {
      page: 0,
      articles: []
    }
  }

  que cambiará a:

   private articlesByCategory: ArticulosPorCategoriaYPagina = { }


La propiedad debe ser dinámica, como hacer eso?
Ls pongo entre corchetes tal que
*/
export interface ArticulosPorCategoriaYPagina {
    [key: string]: {
        pagina: number;
        articulos: Article[]
    }
}
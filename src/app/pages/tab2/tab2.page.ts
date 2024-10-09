import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, SegmentChangeEventDetail, IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../../explore-container/explore-container.component';
import { NgFor } from '@angular/common';
import { ArticlesComponent } from "../../components/articles/articles.component";
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonInfiniteScrollContent, IonInfiniteScroll, IonItem, IonList, IonLabel, NgFor,
    IonSegmentButton, IonSegment, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, ArticlesComponent]
})
export class Tab2Page implements OnInit {



  constructor(private newsService: NewsService) { }

  public categorias: string[] = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']

  public categoriaSeleccionada = this.categorias[0];

  public arrayArticulosPorCategoria: Article[] = []

  private puedeCargarDatos: boolean = true;

  ngOnInit(): void {
    this.cargarArticulos();
  }


  segmentChanged(evento: Event) {
    this.puedeCargarDatos = true;
    //this.infiniteScroll.disabled = false
    console.log(this.infiniteScroll.disabled)
    this.categoriaSeleccionada = (evento as CustomEvent).detail.value;
    // o si arriba tenemos evento:CustomEvent aqui podemos hacer solo evento.detail.value
    // De este modo decimos que la categoriaSeleccionada siempre sea en la que se ha hecho click,
    // esto nos viene bien para poder hacer cosas con esa información, no para que se vea
    // visualmente marcada ya que eso lo hace el segment solito.
    console.log((evento as CustomEvent).detail.value)



    // o si arriba tenemos evento:CustomEvent aqui podemos hacer solo evento.detail.value

    // Sin esto no se recarga el array porque se muestra el array ya con datos previos y se añaden los nuegos digamos
    this.arrayArticulosPorCategoria = []

    this.cargarArticulos();

  }


  private cargarArticulos() {
    /* Esto de
         this.arrayArticulosPorCategoria = [...this.arrayArticulosPorCategoria, ...articlesRecibidos]
         viene a ser equivalente a la linea comentada debajo. 
          Le dijo que el array será igual a lo que hay en el array y 
          luego añado los articulos del array de articlesRecibidos.
          Lo que viene haciendo tambien el push pero por verlo de otra forma. 
         Como hacemos  = [cosas dentro]
         dentro de los corchetes no meto los arrays, sino su contenido, por eso hago primero ... de modo que
         "desarma" los array usando solo su contenido.
         */
    // this.newsService.getTopHeadLinesByCategory(this.categoriaSeleccionada)
    this.newsService.getTopHeadLinesByCategory(this.categoriaSeleccionada)

      .subscribe(articlesRecibidos => {

        this.arrayArticulosPorCategoria = [...this.arrayArticulosPorCategoria, ...articlesRecibidos]

        /*
        Por tanto, si quiero que no se acumulen, sino que se carguen solo unos u otros, en lugar de hacer en el sergmentChange

        this.arrayArticulosPorCategoria = [] // Esto para vaciarlo y
        this.cargarArticulos(); // Esto para meter de nuevo lo que toque
       
        podría tener this.arrayArticulosPorCategoria = [...articlesRecibidos] 
        en vez de 
        this.arrayArticulosPorCategoria = [...this.arrayArticulosPorCategoria, ...articlesRecibidos]

        pero ahora mismo no podría reutilizar el codigo tal cual de esa forma.
        De todos modos esto no es optimo ya que siempre se están haciendo consultas a la API aun cuando ya tenía la informacion
        previamnente. Lo cambiaremos.
        
        */
        // le digo que en el arrayArticulos meta .(.push) la desestructuracion "..." de los articulos(...articles)
        // this.arrayArticulosPorCategoria.push(...articles); 
        console.log(articlesRecibidos);
      });
  }

  //Le digo a @ViewChild que busque en el templatehtml un componente llamado IonInfiniteScroll
  // al que voy a llamar infiniteScroll  y será de tipo IonInfiniteScroll
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  /*
  Como dato. Si quisiese usar este infniteScroll en el ngOnInit por ejemplo, es decir, antes de realmente haber 
  bajado hasta que el componente se use, tendría error.
  De hecho si implemento el onInit y dentro le ponngo console.log(infiniteScroll) veré un undefined en la consola.
  Para arreglar eso tendría que añadie en el viewchild { static : true} de modo que quedaría.
  
  @ViewChild(IonInfiniteScroll, { static : true }) infiniteScroll!: IonInfiniteScroll;

  Diciendole eso le digo que este disponible desde el principio.
  */

  @ViewChild('infiniteComponente') segment!: IonSegment;


  /* Remuevo los eventos y donde antes habia un event.target lo reemplazo por this.infiniteScroll*/
  /* Quito el setTimeout por ver mejor el codigo nada mas*/
  cargarMasDatos() {

    console.log('entro al cargarMasDatos!');

    if (!this.puedeCargarDatos) {
      console.log("no se pueden cargar mas datos dice el token de control")
      this.infiniteScroll.complete();
      return;
    }
    this.newsService.getTopHeadLinesByCategory(this.categoriaSeleccionada, true)
      .subscribe(articulos => {
        if (articulos.length === this.arrayArticulosPorCategoria.length) {
          console.log("El ultimo articulo recibido y el guardado son el mismo. No hay mas");
          console.log('Dentro del if de que no hay mas datos en el cargarMasDatos, antes deshabilitarlo');
          this.puedeCargarDatos = false;
          // this.infiniteScroll.disabled = true
          this.infiniteScroll.complete();
          return;
        }

        console.log('en el cargar datos pero sin entrar en el if antes del complete...');
        this.infiniteScroll.complete();
        this.arrayArticulosPorCategoria = articulos;
      });
    console.log("ahora cargo, tras terminar el timeout");
  }
}



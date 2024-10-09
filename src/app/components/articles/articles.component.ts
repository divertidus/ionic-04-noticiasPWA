import { Component, OnInit, Input } from '@angular/core';
import { IonGrid, IonRow, IonCardSubtitle, IonCol, IonCard, IonCardTitle, IonImg, IonCardContent } from "@ionic/angular/standalone";
import { NgFor, NgIf } from '@angular/common';
import { Article } from 'src/app/interfaces';
import { ArticleComponent } from "../article/article.component";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  standalone: true,
  styleUrls: ['./articles.component.scss'],
  imports: [IonGrid, IonRow, IonCardSubtitle, IonCol, IonCard, IonCardTitle, IonImg, IonCardContent, NgFor, NgIf, ArticleComponent],
  providers: [Input]
})
export class ArticlesComponent implements OnInit {

  @Input() arrayArticulosEnComponente: Article[] = []

  constructor() { }

  ngOnInit() { }

}

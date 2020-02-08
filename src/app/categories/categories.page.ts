import { Component, OnInit } from '@angular/core';
import { categoriesData,questionsData } from '../data/data';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  catDatas;
  constructor(catDatas:categoriesData,private questions:questionsData) {
    catDatas.read().then((val)=>this.catDatas=val)
    
  }

  selectCategory(category){
    this.questions.read(category.questions).then((val)=>{
      
    })
  }

  ngOnInit() {
  }

}

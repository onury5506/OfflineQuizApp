import { Component, OnInit } from '@angular/core';
import { categoriesData,questionsData } from '../data/data';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  catDatas;
  constructor(catDatas:categoriesData
    ,private questions:questionsData
    ,private router:Router) {
    catDatas.read().then((val)=>this.catDatas=val)
    
  }

  selectCategory(category){
    this.questions.read(category.questions).then((val)=>{
      var navExt:NavigationExtras = {
        state:{
          questions:val,
          background:category.background
        }
      }
      this.router.navigate(["game"],navExt)
    })
  }

  ngOnInit() {
  }

}

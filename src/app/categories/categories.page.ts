import { Component, OnInit } from '@angular/core';
import { categoriesData,questionsData } from '../data/data';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Admob } from '../admob/admob';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  catDatas;
  constructor(catDatas:categoriesData
    ,private questions:questionsData
    ,private router:Router
    ,private admob:Admob) {
    catDatas.read().then((val)=>this.catDatas=val)
    
  }

  navExt:NavigationExtras;

  selectCategory(category){
    this.questions.read(category.questions).then((val)=>{
      this.navExt= {
        state:{
          questions:val,
          background:category.background
        }
      }
      if(this.admob.interstitialReady()){
        this.admob.showInterstitial()
        
        this.admob.admobFree
        .on(this.admob.admobFree.events.INTERSTITIAL_CLOSE)
        .subscribe(()=>{
          this.router.navigate(["game"],this.navExt)
          this.admob.prepareInterstitial()
        });
      }else{
        this.router.navigate(["game"],this.navExt)
      }
      
      
    })
  }

  ngOnInit() {
    this.admob.prepareInterstitial()
  }

}

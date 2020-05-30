import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Question } from '../question/question';
import { categoriesData } from '../data/data';
import {HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Admob } from '../admob/admob';


@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  constructor(private renderer: Renderer2
    ,private activatedRoute: ActivatedRoute
    ,private router:Router
    ,private detector:ChangeDetectorRef
    ,private app: ApplicationRef
    ,public admob:Admob) {}

  @ViewChild('timerBarRef', {static: false}) timerBar:ElementRef;
  @ViewChild('main', {static: false}) mainDiv:ElementRef;
  timerLeft:number = 30;
  score:number=-1;
  level:number=0;
  allQuestions;
  questions;
  question
  lock:boolean = false;
  tmr;
  solvedAll = false;
  solvedNum:number;
  bg;


  

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        if(this.router.getCurrentNavigation().extras.state){
          this.level=0;
          this.allQuestions = this.router.getCurrentNavigation().extras.state.questions
          this.questions = this.allQuestions[this.level]
          this.bg = this.router.getCurrentNavigation().extras.state.background;
          this.takeQuestion()
          this.timerLeft=30;
          this.solvedAll=false;
          this.lock=false;
          this.solvedNum=0;
          this.score=-1;
          setTimeout(()=>{
            this.score=0;
            this.renderer.setStyle(this.timerBar.nativeElement,"width",100+"%");
            this.renderer.setStyle(this.timerBar.nativeElement,"background-color","rgb(0,255,0)");
            this.timerStart()
          },1500)
          this.setBackground()
          this.admob.prepareInterstitial()
        }else{
          this.router.navigateByUrl("")
        }
      }
    )
  }

  ngAfterViewInit() {
    this.setBackground()
    this.admob.prepareInterstitial()
  }

  setBackground(){
    if(this.mainDiv){
      if(this.bg){
        this.renderer.setStyle(this.mainDiv.nativeElement
          ,"background","url('"+this.bg+"')")
      }else{
        this.renderer.setStyle(this.mainDiv.nativeElement
          ,"background","url('/assets/homeBackGround.jpg')")
      }
      this.renderer.setStyle(this.mainDiv.nativeElement
        ,"background-size","cover")
      this.renderer.setStyle(this.mainDiv.nativeElement
        ,"background-position","center center")
    }
  }

  takeQuestion():boolean{
    if(this.questions.length > 0){
      var q = Math.floor(Math.random()*this.questions.length)
      this.question = this.questions[q]
      this.questions.splice(q,1)
      return true;
    }else{
      this.level++;
      if(this.level < this.allQuestions.length){
        this.questions = this.allQuestions[this.level]
        return this.takeQuestion()
      }
    }
    return false;
  }

  toRgbString(r:number, g:number, b:number):String{
    return "rgb("+r+","+g+","+b+")"
  }

  timerStart(){
    this.tmr = setTimeout(()=>{
      this.timerLeft--;
      var color:String = this.toRgbString(255*(30-this.timerLeft)/30,255*(this.timerLeft/30),0);
      this.renderer.setStyle(this.timerBar.nativeElement,"background-color",color);
      this.renderer.setStyle(this.timerBar.nativeElement,"width",(this.timerLeft/30*100)+"%");
      
      if(this.timerLeft==0){
        this.lock=true;
      }else if(!this.lock){
        this.timerStart();
      }
    },1000)
  }

  timerStop(){
    clearTimeout(this.tmr)
  }

  plusHealth(){
    if(this.admob.rewardedReady()){
      this.admob.showRewarded()
      this.admob.setRewardedVideoReward(()=>{
        this.lock=false;
        this.timerLeft = 30;
      })
      this.admob.afterCloseRewarded(()=>{
        if(!this.lock)
          this.timerStart();
      })
    }
    
    
  }

  selectAnswer(answer){
    if(!this.lock && this.score >= 0){
      
      if(answer === this.question.answers[this.question.rightAnswer-1]){
        
        this.solvedNum++;
        this.score += this.timerLeft;
        
        this.renderer.setStyle(this.timerBar.nativeElement,"width",100+"%");
        this.renderer.setStyle(this.timerBar.nativeElement,"background-color","rgb(0,255,0)");
        this.timerStop();
        this.timerLeft = 30;
        this.timerStart();

        if(!this.takeQuestion()){
          
          this.timerStop();
          this.solvedAll=true;
          this.score += this.solvedNum*10;
          this.lock=true;
        }
      }else{
        this.timerStop();
        this.lock=true;
      }
    }
    
  }
  

}

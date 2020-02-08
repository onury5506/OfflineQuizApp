import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Question } from '../question/question';
import { categoriesData } from '../data/data';
import {HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  constructor(private renderer: Renderer2
    ,private activatedRoute: ActivatedRoute
    ,private router:Router) {}

  @ViewChild('timerBarRef', {static: false}) timerBar:ElementRef;
  @ViewChild('main', {static: false}) mainDiv:ElementRef;
  timerLeft:number = 30;
  score:number;
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
          this.solvedAll=false;
          this.lock=false;
          this.solvedNum=0;
          this.score=0;
          this.tmr=30;
          this.timerStart();
          this.questions = this.router.getCurrentNavigation().extras.state.questions
          if(this.router.getCurrentNavigation().extras.state.background){
            console.log("özel background var")
            this.bg = this.router.getCurrentNavigation().extras.state.background;
            
          }
          console.log(this.questions.length)
          this.takeQuestion()
        }else{
          this.router.navigateByUrl("")
        }
      }
    )
  }

  ngAfterViewInit() {
    if(this.bg != "none"){
      this.renderer.setStyle(this.mainDiv.nativeElement
        ,"background","url('"+this.bg+"')")
    }else{
      this.renderer.setStyle(this.mainDiv.nativeElement
        ,"background","/assets/homeBackGround.jpg")
    }
    this.renderer.setStyle(this.mainDiv.nativeElement
      ,"background-size","cover")
    this.renderer.setStyle(this.mainDiv.nativeElement
      ,"background-position","center center")
  }

  takeQuestion():boolean{
    if(this.questions.length > 0){
      var q = Math.floor(Math.random()*this.questions.length)
      this.question = this.questions[q]
      this.questions.splice(q,1)
      return true;
    }
    return false;
  }

  toRgbString(r:number, g:number, b:number):String{
    return "rgb("+r+","+g+","+b+")"
  }

  timerStart(){
    this.tmr = setInterval(()=>{
      this.timerLeft--;
      var color:String = this.toRgbString(255*(30-this.timerLeft)/30,255*(this.timerLeft/30),0);
      this.renderer.setStyle(this.timerBar.nativeElement,"background-color",color);
      this.renderer.setStyle(this.timerBar.nativeElement,"width",(this.timerLeft/30*100)+"%");
      if(this.timerLeft==0){
        this.timerStop()
        this.lock=true;
      }
    },1000)
  }

  timerStop(){
    clearInterval(this.tmr)
  }

  selectAnswer(answer){
    if(!this.lock){
      console.log(answer)
      if(answer === this.question.answers[this.question.rightAnswer-1]){
        console.log("DOĞRU CEVAP")
        this.solvedNum++;
        this.score += this.timerLeft;
        
        this.renderer.setStyle(this.timerBar.nativeElement,"width",100+"%");
        this.renderer.setStyle(this.timerBar.nativeElement,"background-color","rgb(0,255,0)");
        this.timerStop();
        this.timerLeft = 30;
        this.timerStart();

        if(!this.takeQuestion()){
          console.log("Sorular bitti")
          this.timerStop();
          this.solvedAll=true;
          this.score += this.solvedNum*10;
          this.lock=true;
        }
      }else{
        console.log("YANLIŞ CEVAP")
        this.timerStop();
        this.lock=true;
      }
    }
    
  }
  

}

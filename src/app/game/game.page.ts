import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Question } from '../question/question';
import { categoriesData } from '../data/data';
import {HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  constructor(private renderer: Renderer2) { }
  @ViewChild('timerBarRef', {static: false}) timerBar:ElementRef;
  timerLeft:number = 30;
  score:number = 100;
  question:Question = new Question("who is bla bla ",["ali","veli","ayşe","hadime"],3)
  lock:boolean = false;
  tmr;

  ngOnInit() {
    this.timerStart();
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
        this.score += this.timerLeft;
        
        this.renderer.setStyle(this.timerBar.nativeElement,"width",100+"%");
        this.renderer.setStyle(this.timerBar.nativeElement,"background-color","rgb(0,255,0)");
        this.timerStop();
        this.timerLeft = 30;
        this.timerStart();
      }else{
        console.log("YANLIŞ CEVAP")
        this.timerStop();
        this.lock=true;
      }
    }
    
  }
  

}

import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Admob } from '../admob/admob';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private admob:Admob) { }

  ngOnInit() {
    this.admob.showBanner()
  }

  appName:String = "QUIZ APP";

  getBestScore():number {
    return 500;
  }
}

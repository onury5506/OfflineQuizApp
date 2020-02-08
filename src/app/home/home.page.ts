import { Component } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() { }

  ngOnInit() {
  }

  appName:String = "QUIZ APP";

  getBestScore():number {
    return 500;
  }
}

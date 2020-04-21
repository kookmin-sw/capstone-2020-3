import { Component, OnInit } from '@angular/core';
declare let webgazer: any;

@Component({
  selector: 'app-view-portfolio',
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.scss']
})
export class ViewPortfolioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // webgazer.setGazeListener = (data, elapsedTime) => {
    //   const xprediction = data.x;
    //   const yprediction = data.y;
    //   console.log(xprediction, yprediction);
    //   console.log(elapsedTime);
    // };
    webgazer.begin();
  }

}

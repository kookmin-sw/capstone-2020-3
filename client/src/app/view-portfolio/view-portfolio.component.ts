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
    webgazer.gazeListener = (prediction, elapsedTime) => {
      console.log(prediction, elapsedTime);
    };
    // webgazer.setGazeListener = (data, elapsedTime) => {
    //   const xprediction = data.x;
    //   const yprediction = data.y;
    //   console.log(xprediction, yprediction);
    //   console.log(elapsedTime);
    // };
    // webgazer.setGazeListener = (data, clock) => {
    //   console.log(data);
    //   console.log(clock);
    // };
    // webgazer.setRegression('ridge');
    webgazer.begin();
    webgazer.showPredictionPoints(true);
    setInterval(() => {
      console.log(webgazer.getCurrentPrediction());
    }, 1000);
    // console.log(webgazer.getTracker);
  }

}

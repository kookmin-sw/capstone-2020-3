import { Component, OnInit, ElementRef } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

declare let webgazer: any;

@Component({
  selector: 'app-view-portfolio',
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.scss']
})
export class ViewPortfolioComponent implements OnInit {
  navbar: NavbarComponent;
  userInfo: any;

  constructor(
    private element: ElementRef,
    public router: Router,
    public authService: AuthenticationService,
  ) {
    this.userInfo = this.authService.currentUserValue["userInfo"];
    this.nickName = this.userInfo.nickName;
   }
  public pageN: number;
  public images: any;
  public nickName: any;
  public innerWidth: any;
  public innerHeight: any;
  public recordData = [];
  public paramData = {
    'portfolioName':'',
    'portfolioIndex':'',
    'x':'',
    'y':''
  };
  public paramEyetrackingData = {
    'name':'jaewook',
    'index':'2'
  }

  /**
   * png만들기
   * @param paramData
   */
  makeHeatmap(paramEyetrackingData: any) {
    this.authService.makeEyetrackingPng(this.paramEyetrackingData)
    .pipe()
      .subscribe(data => {
        console.log("data : " + JSON.stringify(data));
      },
      err => {
          console.log("ERROR!: ", err);
    });
  }


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
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      let temp = webgazer.getCurrentPrediction();
      // console.log(this.innerWidth, this.innerHeight);
      this.paramData.portfolioName = this.userInfo.nickName;
      this.paramData.portfolioIndex = '2';
      this.paramData.x = temp.x.toString();
      this.paramData.y = temp.y.toString();
      console.log(this.paramData);

      // param데이터 보내주는 부분.
      this.authService.postEyetrackingData(this.paramData)
      .pipe()
        .subscribe(data => {
          console.log("data : " + JSON.stringify(data));
        },
        err => {
            console.log("ERROR!: ", err);
      });
      temp = 0;

    }, 1000);
    // console.log(webgazer.getTracker);

    // images 개수를 가져와서 넣어주는 방식임.
    this.images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // hard coding..
  }

  doCancel() {
    webgazer.gazeListener = (prediction, elapsedTime) => {
      console.log(prediction, elapsedTime);
    };
    webgazer.end();
    webgazer.showPredictionPoints(false);
    webgazer = '';
    this.router.navigate(['/portfolio']);
  }

}

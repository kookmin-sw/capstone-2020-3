import { Component, OnInit, ElementRef } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Router } from '@angular/router';
declare let webgazer: any;
declare let AWS: any;

@Component({
  selector: 'app-view-portfolio',
  templateUrl: './view-portfolio.component.html',
  styleUrls: ['./view-portfolio.component.scss']
})
export class ViewPortfolioComponent implements OnInit {
  navbar: NavbarComponent;
  constructor(
    private element: ElementRef,
    public router: Router,
  ) { }
  public pageN: number;
  public images: any;
  public innerWidth: any;
  public innerHeight: any;
  public recordData = [];

  ngOnInit() {
    // Configure Credentials to use Cognito
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:3f38c526-6463-4312-8a5e-c9bc106a29a9'
    });

    AWS.config.region = 'us-east-1';
    // We're going to partition Amazon Kinesis records based on an identity.
    // We need to get credentials first, then attach our event listeners.
    AWS.config.credentials.get(function (err) {
      // attach event listener
      if (err) {
        alert('Error retrieving credentials.');
        console.error(err);
        return;
      }
      // create Amazon Kinesis service object
      setInterval(function() {
        const kinesis = new AWS.Kinesis({
          apiVersion: '2013-12-02'
        });
        // if (!this.recordData.length) {
          // return;
        // }
        // upload data to Amazon Kinesis
        this.recordData = '128 256';
        const params = {
          Data: (JSON.stringify(this.recordData)),
          PartitionKey: 'partition-' + AWS.config.credentials.identityId,
          StreamName: 'text'
        };
        // tslint:disable-next-line:no-unused-expression
        kinesis.putRecord(params, (err, data) => {
          console.log(err, data);
        });
        // clear record data
        this.recordData = [];
      }, 1000);
    });

    // navbar.classList.remove('navbar-transparent');
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
      console.log(webgazer.getCurrentPrediction());
      console.log(this.innerWidth, this.innerHeight);
    }, 1000);
    // console.log(webgazer.getTracker);

    // images 개수를 가져와서 넣어주는 방식임.
    this.images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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

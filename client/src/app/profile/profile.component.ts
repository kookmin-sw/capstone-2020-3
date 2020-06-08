import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { AuthenticationService } from '../_services/authentication.service';

declare let AWS: any;

// core components
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2
} from './charts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    userInfo: any;

    public datasets: any;
    public data: any;
    public salesChart;
    public clicked: boolean = true;
    public clicked1: boolean = false;
    public dataList: any;
    public paramInfo: any;
    public images: any;
    public nickName: any;
    public topNames: any = {};
    constructor(
        public authService: AuthenticationService,
    ) {
        this.userInfo = this.authService.currentUserValue["userInfo"];
        this.nickName = this.userInfo.nickName;
    }


    ngOnInit() {
        // Set up credentials
        AWS.config.credentials = new AWS.Credentials({
        // 이것들은 github에 올라가면 안됨.
        accessKeyId: 'secret', secretAccessKey: 'this is secret' // secret config code
        });

        const params = {
        Bucket: 'portfoliosrc',
        Key: 'portfolio_pdf/portfolio.txt'
        };

        const s3 = new AWS.S3();
        let txts = '';

        s3.getObject(params, function(err, data) {
            if (err) {
                console.error(err); // an error occurred
            } else {
                console.log(data);
                const txtString = new TextDecoder('utf-8').decode(data.Body);
                txts = (JSON.parse(txtString));
                console.log(txts['contents']);
            }
        });
        this.topNames = txts;
        // console.log(this.topNames['contents']);
        // images 개수를 가져와서 넣어주는 방식임.
        this.images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // hard coding..

        // var ordersChart = new Chart(chartOrders, {
        //   type: 'bar',
        //   options: chartExample2.options,
        //   data: chartExample2.data
        // });

        // var chartSales = document.getElementById('chart-sales');

        // this.salesChart = new Chart(chartSales, {
        //     type: 'line',
        //     options: chartExample1.options,
        //     data: chartExample1.data
        // });
    }

    // public updateOptions() {
    //     this.salesChart.data.datasets[0].data = this.data;
    //     this.salesChart.update();
    // }

}

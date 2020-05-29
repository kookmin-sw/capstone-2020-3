import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

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

    public datasets: any;
    public data: any;
    public salesChart;
    public clicked: boolean = true;
    public clicked1: boolean = false;

    public images: any;

    constructor() { }

    ngOnInit() {

        // images 개수를 가져와서 넣어주는 방식임.
        this.images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        this.datasets = [
            [0, 20, 10, 30, 15, 40, 20, 60, 60],
            [0, 20, 5, 25, 10, 30, 15, 40, 40]
        ];
        this.data = this.datasets[0];


        var chartOrders = document.getElementById('chart-orders');

        parseOptions(Chart, chartOptions());


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

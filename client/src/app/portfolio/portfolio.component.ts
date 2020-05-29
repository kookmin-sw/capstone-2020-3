import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { LocalDatePipe } from '../_pipes/local-date';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthenticationService } from '../_services/authentication.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  userInfo: any;
  paramInfo = {
    "userInfoSeq": "",
    "queryType": "list",
    "searchInfo": "",
    "isAdminUserYn": "N",
    "offset": 0,
    "limit": 10
  }

  dataTotalCount: number = 0;
  dataList: any = [];
  currentPage = 1;

  config: any;

  constructor(
    public router: Router,
    public localDatePipe: LocalDatePipe,
    public spinner: NgxSpinnerService,
    public authService: AuthenticationService,
  ) {
    if (this.authService.currentUserValue) {
      this.userInfo = this.authService.currentUserValue["userInfo"];
      if (this.userInfo) {
        this.paramInfo.userInfoSeq = this.userInfo.userInfoSeq;
      }
    }
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.dataTotalCount
    };
  }

  ngOnInit() {
    setTimeout(() => {
      this.getUserDevices();
    }, 300);
  }


  /**
   * 등록된 사용자 장치들
   */
  getUserDevices() {
    // this.spinner.show();

    // this.deviceService.getUserDevices(this.paramInfo)
    // .pipe(first())
    // .subscribe(
    //     data => {
    //         this.spinner.hide();
    //         //console.log("data", data);
    //         if(!data.error){
    //           this.dataTotalCount = data.dataTotalCount;
    //           this.dataList = data.dataList;
    //         }
    //     },
    //     error => {
    //       this.spinner.hide();
    //     });
  }

  /**
   * 새로운 장치 등록 페이지 이동
   */
  goAddPortfolio() {
    this.router.navigate(['/add-portfolio']);
  }


  /**
   * 새로운 장치 등록 페이지 이동
   */
  goViewPortfolio() {
    this.router.navigate(['/view-portfolio']);
  }

  /**
   * 사용자 정의 장치 상세페이지 이동
   * @param deviceSettingInfoSeq 
   */
  goViewDevice(deviceSettingInfoSeq: string) {
    if (deviceSettingInfoSeq) {
      //console.log("deviceSettingInfoSeq", deviceSettingInfoSeq);
      this.router.navigate(['/user-view-device/' + deviceSettingInfoSeq]);
    }
  }

  /**
   * 사용자 기준 시간 변경
   * @param date 
   */
  onLocalDate(date, format: string) {
    if (date) {
      if (format == "") {
        format = "yyyy-MM-dd HH:mm";
      }
      return this.localDatePipe.transform(date, format);
    }
  }

  pageChanged(event) {
    this.config.currentPage = event;
    //console.log("this.config.currentPage", this.config.currentPage);
  }

}
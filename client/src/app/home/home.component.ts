import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { NgxSpinnerService } from 'ngx-spinner';

import { CommonService } from '../_services/common.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    @ViewChild('mainMap') mapElement: ElementRef;

    userInfo: any;

    localeLanguage: string;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public zone: NgZone,
        public sanitizer: DomSanitizer,
        public spinner: NgxSpinnerService,
        public commonService: CommonService
    ) {
        this.localeLanguage = this.commonService.getLocaleLanguage();

    }

    ngOnInit() {

    }

}

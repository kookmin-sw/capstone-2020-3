import { Component, OnInit, Inject, Renderer, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/platform-browser';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private _router: Subscription;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    userLang: string;
    
    constructor( 
        private renderer : Renderer, 
        private router: Router, 
        @Inject(DOCUMENT,) 
        private document: any, 
        private element : ElementRef, 
        public location: Location,
        public translate: TranslateService
    ) {
        // Google Analytics 로직 구현
        // https://github.com/codediodeio/angular-gtag 플로그인 설치되어 있음
        
        // 언어설정
        this.translateConfig();
    }

    ngOnInit() {
        var navbar : HTMLElement = this.element.nativeElement.children[0].children[0];
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            }else{
                window.document.activeElement.scrollTop = 0;
            }
            this.navbar.sidebarClose();
        });
        this.renderer.listenGlobal('window', 'scroll', (event) => {
            const number = window.scrollY;
            if (number > 150 || window.pageYOffset > 150) {
                // add logic
                navbar.classList.remove('navbar-transparent');
            } else {
                // remove logic
                navbar.classList.add('navbar-transparent');
            }
        });
        var ua = window.navigator.userAgent;
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            var version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        if (version) {
            var body = document.getElementsByTagName('body')[0];
            body.classList.add('ie-background');

        }

    }
    translateConfig() {
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en');

        this.userLang = navigator.language.split('-')[0]; // use navigator lang if available
        this.userLang = /(en|ko)/gi.test(this.userLang) ? this.userLang : 'en';

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use(this.userLang);
    }

    removeNav() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice( 1 );
        if(titlee === 'map'){
            return false;
        }
        else {
            return true;
        }
    }

    removeFooter() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice( 1 );
        if(titlee === 'signin' || titlee === 'signup' || titlee === 'map'){
            return false;
        }
        else {
            return true;
        }
    }
}

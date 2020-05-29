import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services/authentication.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;

    constructor(
        private router: Router,
        private element : ElementRef,
        public location: Location, 
        public authService: AuthenticationService    
    ) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
        let titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '/home' ) {
            return true;
        }
        else {
            return false;
        }
    }
    isMap(){
        let titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '/view-portfolio' ) {
            return true;
        }
        else {
            return false;
        }
    }
    isLogin() {
        const currentUser = this.authService.currentUserValue;
        //console.log("currentUser", currentUser);
        if (currentUser) {
            // authorised so return true
            return true;
        }else{
            return false;
        }
    }

    isAdmin() {
        const currentUser: any = this.authService.currentUserValue;
        if (currentUser && currentUser.userInfo && currentUser.userInfo["isAdminUserYn"] == "Y") {
            // authorised so return true
            return true;
        }else{
            return false;
        }
    }

    isDocumentation() {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    doLogout(){
        this.authService.logout()
        .pipe(first())
        .subscribe(
            data => {
                if(!data.error){
                    this.router.navigate(['/']);
                }
            },
            error => {
                
            });
    }
}

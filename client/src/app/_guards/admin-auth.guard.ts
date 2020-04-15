import { Injectable } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser : any = this.authenticationService.currentUserValue;
    //console.log("AdminAuthGuard currentUser", currentUser);
    if (currentUser) {
        // authorised so return true
        if(currentUser.userInfo && currentUser.userInfo["isAdminUserYn"] == "Y"){
          return true;
        }else{
          this.router.navigate(['/home'], {});
          return false;
        }
    }else{
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';

import { CommonService } from '../_services/common.service';
import { AlertService } from '../_services/alert.service';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  today : Date = new Date();
  loginInfoForm : FormGroup;
  isSnsSignup : boolean;
  submitted = false;
  returnUrl: string;

  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public commonService: CommonService,
    public alertService: AlertService,
    public authService: AuthenticationService,
    public userService : UserService
  ) { 
    if (this.authService.currentUserValue) { 
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.isSnsSignup = false;

    this.loginInfoForm = this.formBuilder.group({  
      userId: new FormControl('', Validators.compose([ Validators.required ])),
      userPwd: new FormControl('', Validators.compose([ Validators.required ]))
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { 
    //console.log("controls", this.userInfoForm.controls);
    return this.loginInfoForm.controls; 
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginInfoForm.invalid) {
        return;
    }else{
      this.doLogin(this.f.userId.value, this.f.userPwd.value, "email");
    }
  }

  /**
   * 로그인
   * @param userId 
   * @param userPwd 
   * @param loginRouteType 
   */
  doLogin(userId:string, userPwd:string, loginRouteType:string){
    this.spinner.show();

    this.authService.login(userId, userPwd, loginRouteType)
    .pipe(first())
    .subscribe(
        data => {
            this.spinner.hide();
            // console.log("data", data);
            if(data.error){
              let errMsg = this.commonService.getTranslateValue("SIGN_IN.MESSAGE.ERROR.USER_PWD_WRONG");
              if(data.message == "login_user_id_none"){
                errMsg = this.commonService.getTranslateValue("SIGN_IN.MESSAGE.ERROR.USER_ID_NONE");
              }else if(data.message == "login_user_none_verify"){
                errMsg = this.commonService.getTranslateValue("SIGN_IN.MESSAGE.ERROR.USER_NONE_VERTIFY");
              }

              this.alertService.error(errMsg);
            }else{
              this.router.navigate([this.returnUrl]);
            }
        },
        error => {
            this.alertService.error(error);
            this.spinner.hide();
        });
  }

}


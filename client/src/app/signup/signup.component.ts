import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgxSpinnerService } from 'ngx-spinner';

import { EmailValidator, InputValidator } from '../_valiators/custom-valiator';

import { CommonService } from '../_services/common.service';
import { UserService } from '../_services/user.service';

@Component({
    selector: 'signup-msg-modal-content',
    template: `
        <div class="modal-header">
            <h5 class="modal-title text-center">{{ title }}</h5>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">{{ message }}</div>
        <div class="modal-footer">
            <div class="right-side">
                <button type="button" class="btn btn-default btn-link" (click)="activeModal.close('Close click')">{{ 'BUTTONS.TITLE.OK' | translate }}</button>
            </div>
        </div>
    `
})
export class SignUpMsgModalContent {
    @Input() title;
    @Input() message;

    constructor(public activeModal: NgbActiveModal) {}
}

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    today : Date = new Date();
    userInfoForm : FormGroup;
    isSnsSignup : boolean;
    submitted = false;
    signupInfo = {
        "userId":"",
        "userPwd":"",
        "userPwdConfirm":"",
        "signupRouteType":"email",
        "signupSnsId":"",
        "accessToken":"",
        "userName":"",
        "firstName":"",
        "lastName":"",
        "nickName":"",
        "gender":"H",
        "birthday":"",
        "localeLanguage":""
    };

    constructor(
        public formBuilder: FormBuilder,
        public router: Router,
        public spinner: NgxSpinnerService,
        public modalService: NgbModal,
        public commonService: CommonService,
        public userService : UserService
    ) { 
        this.isSnsSignup = false;

        this.signupInfo.localeLanguage = this.commonService.getLocaleLanguage();

        if(this.isSnsSignup){
            // SNS를 통한 회원가입
            this.userInfoForm = this.formBuilder.group({  
                userId: new FormControl('', Validators.compose([ Validators.required ])),
                firstName: new FormControl('', Validators.compose([ Validators.required ])),
                lastName: new FormControl('', Validators.compose([ Validators.required ]))
            });
        }else{
            this.userInfoForm = this.formBuilder.group({  
                userId: new FormControl('', Validators.compose([ Validators.required, EmailValidator.invalidEmail ])),
                //userPwd: new FormControl('', Validators.compose([ Validators.required, Validators.pattern('^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[~!@#$%^&*()_+|<>?:{}]).{8,20}$') ])),
                userPwd: new FormControl('', Validators.compose([ Validators.required, Validators.minLength(4), Validators.maxLength(20) ])),
                userPwdConfirm: new FormControl('', Validators.compose([ Validators.required ])),
                firstName: new FormControl('', Validators.compose([ Validators.required ])),
                lastName: new FormControl('', Validators.compose([ Validators.required ]))
            }, { validator: this.matchingPasswords('userPwd', 'userPwdConfirm')});
        }
    }

    ngOnInit() {}

    // convenience getter for easy access to form fields
    get f() { 
        //console.log("controls", this.userInfoForm.controls);
        return this.userInfoForm.controls; 
    }


    /**
     * 비밀번호와 비밀번호 확인 입력값이 같은지 확인
     * @param passwordKey 
     * @param confirmPasswordKey 
     */
    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
        // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
        return (group: FormGroup): {[key: string]: any} => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];

            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }
    
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.userInfoForm.invalid) {
            //this.spinner.hide();
            return;
        }else{
            //console.log("this.userInfoForm.value", this.userInfoForm.value);

            this.signupInfo.userId = this.userInfoForm.value.userId;
            this.signupInfo.userPwd = this.userInfoForm.value.userPwd;
            this.signupInfo.firstName = this.userInfoForm.value.firstName;
            this.signupInfo.lastName = this.userInfoForm.value.lastName;
            
            this.spinner.show();
            this.userService.joinUserProc(this.signupInfo)
            .subscribe(data => {
                //console.log("data : " + JSON.stringify(data));
                //console.log("data", data);

                if(!data.error && data.message == "join_success"){
                    this.spinner.hide();
                    this.onJoinUserMessagePopup(this.commonService.getTranslateValue("SIGN_UP.EMAIL_AUTH_INFO.TITLE"), this.commonService.getTranslateValue("SIGN_UP.EMAIL_AUTH_INFO.MESSAGE.SIGN_UP"));
                    
                    setTimeout(() => {
                        this.router.navigate(['/signin']);
                    }, 200);
                }else{
                    this.spinner.hide();
                    if(data.message == "join_user_id_exist"){
                        this.onJoinUserMessagePopup(this.commonService.getTranslateValue("ALERT.TITLE.SIGN_UP_JOIN"), this.commonService.getTranslateValue("SIGN_UP.MESSAGE.ERROR.USER_ID_EXIST"));
                    }else{
                        this.onJoinUserMessagePopup(this.commonService.getTranslateValue("ALERT.TITLE.SIGN_UP_JOIN"), this.commonService.getTranslateValue("MESSAGE.ERROR.SIGN_UP_JOIN"));
                    }
                }
            },
            err => {
                this.spinner.hide();
                console.log("ERROR!: ", err);
            });
        }
    }

    /**
     * 회원 가입 후 팝업창
     * @param title 
     * @param message 
     */
    onJoinUserMessagePopup(title: string, message: string){
        console.log("title", title);
        console.log("message", message);
        const modalRef = this.modalService.open(SignUpMsgModalContent);
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
    }

}

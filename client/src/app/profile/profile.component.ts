import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { LocalDatePipe } from '../_pipes/local-date'; 

import { AuthenticationService } from '../_services/authentication.service';

import { CommonService } from '../_services/common.service';
import { UserService } from '../_services/user.service';

class ImageSnippet {
    pending: boolean = false;
    status: string = 'init';

    constructor(public src: string, public file: File) {}
}

//editPopup 화면
@Component({
    selector: 'edit-msg-modal-content',
    templateUrl: `./profile.setting.component.html`,
    styleUrls: ['./profile.setting.component.scss']
})
export class ProfileMsgModalContent implements OnInit {
    selectedFile: ImageSnippet;

    editForm: FormGroup;
    submitted = false;
    isSnsSignup: boolean;

    userBirthday: string;
    
    profileInfo = {
        "userInfoSeq": "",
        "firstName": "",
        "lastName": "",
        "nickName": "",
        "gender": "",
        "genderDisp": "",
        "birthday": "",
        "profileContents": "",
        "profilePhoto":"",
        "localeLanguage": "",
        "isNickNameChange": ""
    };

    userInfo: any;

    constructor(
        public activeModal: NgbActiveModal,
        public formBuilder: FormBuilder,
        public sanitizer: DomSanitizer,
        public commonService: CommonService,
        public spinner: NgxSpinnerService,
        public router: Router,
        public userService: UserService,
        public modalService: NgbModal,
        public authService: AuthenticationService
    ) {
        if (this.authService.currentUserValue) {
            this.userInfo = this.authService.currentUserValue["userInfo"];
            //console.log("this.userInfo", this.userInfo);
        }
        
        this.profileInfo.localeLanguage = this.commonService.getLocaleLanguage();
        
        this.userBirthday = this.userInfo.birthday;
        
        // 선택적으로 기입하는 것이기에 제한 없음
        this.editForm = this.formBuilder.group({
            firstName: new FormControl(this.userInfo.firstName, Validators.compose([ Validators.required ])),
            lastName: new FormControl(this.userInfo.lastName, Validators.compose([ Validators.required ])),
            nickName: new FormControl(this.userInfo.nickName),
            gender: new FormControl(this.userInfo.gender),
            profileContents: new FormControl(this.userInfo.profileContents)
        });
    }

    ngOnInit() { }

    get f() { return this.editForm.controls; }

    /**
     * 사용자 프로필 사진 가져오기
     */
    onGetUserProfileImage() {
        if(this.userInfo.profilePhoto){
            return this.sanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64," + this.userInfo.profilePhoto);
            //return this.sanitizer.bypassSecurityTrustUrl(this.userInfo.profilePhoto);
        }else{
            return "assets/img/faces/default-profile.jpg";
        }
    }

    /**
     * 이미지 사진 변경
     * @param imageInput 
     */
    doChoiceImgeFile(imageInput: any) {
        // 참고 : https://medium.freecodecamp.org/how-to-make-image-upload-easy-with-angular-1ed14cb2773b
        // TODO: 추후에 정사각형으로 자를 경우 : https://codepen.io/enlcxx/pen/vmadQz?editors=1010, https://www.npmjs.com/package/ngx-image-cropper
        
        const file: File = imageInput.files[0];
        const reader = new FileReader();
    
        reader.addEventListener('load', (event: any) => {
            this.selectedFile = new ImageSnippet(event.target.result, file);
            //console.log("this.selectedFile", this.selectedFile);
            if(this.selectedFile.src){
                const fileType = this.selectedFile.file.type;
                const findStr = "data:" + fileType + ";base64,";
                this.userInfo.profilePhoto = this.selectedFile.src.replace(findStr, '');
            }
        });
    
        reader.readAsDataURL(file);
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.editForm.invalid) {
            console.log("==== this.editForm.invalid ====");
            //this.spinner.hide();
            return;
        } else {
            let birthday = "";
            if(this.userBirthday["year"]){
                birthday = (this.userBirthday["year"] + '-' + this.userBirthday["month"] + '-' + this.userBirthday["day"]);
            }

            this.profileInfo.firstName = this.editForm.value.firstName;
            this.profileInfo.lastName = this.editForm.value.lastName;
            this.profileInfo.nickName = this.editForm.value.nickName;
            this.profileInfo.birthday = birthday;
            this.profileInfo.gender = this.editForm.value.gender;
            this.profileInfo.profilePhoto = this.userInfo.profilePhoto;
            this.profileInfo.profileContents = this.editForm.value.profileContents;
            this.profileInfo.userInfoSeq = this.userInfo.userInfoSeq;
            
            //console.log("this.profileInfo", this.profileInfo);
            
            this.spinner.show();
            this.userService.editUserProc(this.profileInfo)
                .subscribe(data => {
                    //console.log("data : " + JSON.stringify(data));
                    //console.log("data", data);
                    if (!data.error && data.message == "update_success") {
                        this.spinner.hide();
                        this.editAlertPopup(this.commonService.getTranslateValue("SETTINGS.TITLE"), this.commonService.getTranslateValue("SETTINGS.OK"));
                        setTimeout(() => {
                            this.closeModal(this.profileInfo);
                        }, 100);
                    } else {
                        this.spinner.hide();
                        this.editAlertPopup(this.commonService.getTranslateValue("SETTINGS.TITLE"), this.commonService.getTranslateValue("SETTINGS.FAIL"));
                        setTimeout(() => {
                            this.closeModal(this.profileInfo);
                        }, 100);
                    }
                },
                err => {
                    this.spinner.hide();
                    console.log("ERROR!: ", err);
                });
        }
    }

    /**
     * 세팅페이지 알람창
     * @param title 
     * @param message 
     */
    editAlertPopup(title: string, message: string) {
        const modalRef = this.modalService.open(AlertModalContent);
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
    }

    /**
     * modal 닫기
     */
    closeModal(data: any) {
        if (data) {
            this.activeModal.dismiss(data);
        } else {
            this.activeModal.dismiss();
        }
    }
}

//세팅 알람창 component
@Component({
    selector: 'alert-msg-modal-content',
    template: `
        <div class="modal-header">
            <h5 class="modal-title text-center">{{ title }}</h5>
            <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">{{ message }}</div>
    `
})
export class AlertModalContent {
    @Input() title;
    @Input() message;

    constructor(public activeModal: NgbActiveModal) { }
}

// profile 화면
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    userInfo: any;
    updateInfo: any;
    
    constructor(
        public sanitizer: DomSanitizer,
        public authService: AuthenticationService,
        public modalService: NgbModal,
        public localDatePipe: LocalDatePipe,
        public userService: UserService,
    ) {
        // console.log(this.authService);
        if(this.authService.currentUserValue){
            this.userInfo = this.authService.currentUserValue["userInfo"];
        }
        // GenderDispaly할 때 Fullname으로 처리하는 부분
        if(this.userInfo.gender == "M"){
            this.userInfo.genderDisp = "Male";
        }else if(this.userInfo.gender == "F"){
            this.userInfo.genderDisp = "Female";
        }else if(this.userInfo.gender == "O"){
            this.userInfo.genderDisp = "Other";
        }else{
            //this.userInfo.genderDisp = "Hidden";
            this.userInfo.genderDisp = "";
        }
    }

    ngOnInit() {}

    /**
     * 사용자 프로필 사진 가져오기
     */
    onGetUserProfileImage() {
        if(this.userInfo.profilePhoto){
            return this.sanitizer.bypassSecurityTrustUrl("data:image/jpeg;base64," + this.userInfo.profilePhoto);
        }else{
            return "assets/img/faces/default-profile.jpg";
        }
    }

    //EditPopup 열고 닫았을때 처리
    openEditPopup() {
        let modalRef = this.modalService.open(ProfileMsgModalContent);
        if (modalRef) {
            modalRef.result.then(
                (error: any) => {
                },
                (data: any) => {
                    if (data) {
                        // 복사를 위해 가져와서 새로운 정보 넣어주기
                        // console.log(data.birthday);
                        this.updateInfo = JSON.parse(localStorage.getItem('currentUser'));
                        this.updateInfo.userInfo.firstName = data.firstName;
                        this.updateInfo.userInfo.lastName = data.lastName;
                        this.updateInfo.userInfo.nickName = data.nickName;
                        this.updateInfo.userInfo.birthday = data.birthday;
                        this.updateInfo.userInfo.gender = data.gender;
                        this.updateInfo.userInfo.profilePhoto = data.profilePhoto;
                        this.updateInfo.userInfo.profileContents = data.profileContents;

                        // localStorage에 업데이트
                        this.authService.updateCurrentUserInfo(this.updateInfo);

                        // 업데이트 정보 새로고침 안하고 바로 볼 수 있도록.
                        this.authService.currentUserValue["userInfo"].firstName = data.firstName;
                        this.authService.currentUserValue["userInfo"].lastName = data.lastName;
                        this.authService.currentUserValue["userInfo"].nickName = data.nickName;
                        this.authService.currentUserValue["userInfo"].birthday = data.birthday;
                        this.authService.currentUserValue["userInfo"].gender = data.gender;
                        this.authService.currentUserValue["userInfo"].profilePhoto = data.profilePhoto;
                        this.authService.currentUserValue["userInfo"].profileContents = data.profileContents;

                        // GenderDispaly할 때 Fullname으로 처리하는 부분
                        if(this.userInfo.gender == "M"){
                            this.userInfo.genderDisp = "Male";
                        }else if(this.userInfo.gender == "F"){
                            this.userInfo.genderDisp = "Female";
                        }else if(this.userInfo.gender == "O"){
                            this.userInfo.genderDisp = "Other";
                        }else{
                            //this.userInfo.genderDisp = "Hidden";
                            this.userInfo.genderDisp = "";
                        }
                    }
                });
        }
     }

    //EditPopup 열고 닫았을때 처리
    changePasswordPopup() {
        let modalRef2 = this.modalService.open(ChangePasswordModalContent);
        if (modalRef2) {
            modalRef2.componentInstance.userInfoSeq = JSON.parse(localStorage.getItem('currentUser')).userInfo.userInfoSeq;
            modalRef2.componentInstance.loginToken = JSON.parse(localStorage.getItem('currentUser')).loginToken;

            modalRef2.result.then(
                (error: any) => {
                    // console.log(error);
                },
                (data: any) => {
                    if (data) {
                        // console.log(data);
                    }
                });
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
}

//세팅 알람창 component
@Component({
    selector: 'change-password-modal-content',
    templateUrl: `./profile.changepw.component.html`,
    styleUrls: ['./profile.setting.component.scss']
})
export class ChangePasswordModalContent {
    @Input() public userInfoSeq;
    @Input() public loginToken;

    passwordForm: FormGroup;

    pwdChangeInfo = {
        "restApiKey": "",
        "loginToken": "",
        "userInfoSeq": "",
        "newUserPwd": ""
    };
    submitted = false;

    constructor(
        public activeModal: NgbActiveModal,
        public formBuilder: FormBuilder,
        public sanitizer: DomSanitizer,
        public commonService: CommonService,
        public spinner: NgxSpinnerService,
        public router: Router,
        public userService: UserService,
        public modalService: NgbModal,
        public authService: AuthenticationService
    ) {
        // 폼 양식 맞도록 제한
        this.passwordForm = this.formBuilder.group({
            password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(20)])),
            passwordCheck: new FormControl('', Validators.compose([Validators.required])),
        }, { validator: this.matchingPasswords('password', 'passwordCheck')});
    }

    ngOnInit() { }

    get f() { return this.passwordForm.controls; }

    /**
     * 비밀번호와 비밀번호 확인 입력값이 같은지 확인
     * @param passwordKey 
     * @param confirmPasswordKey 
     */
    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
        // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];

            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }

    /**
     * 세팅페이지 알람창
     * @param title 
     * @param message 
     */
    editAlertPopup(title: string, message: string) {
        const modalRef = this.modalService.open(AlertModalContent);
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
    }

    /**
     * modal 닫기
     */
    closeModal(data: any) {
        if (data) {
            this.activeModal.dismiss(data);
        } else {
            this.activeModal.dismiss();
        }
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.passwordForm.invalid) {
            //this.spinner.hide();
            return;
        } else {
            //this.pwdChangeInfo.userInfoSeq = JSON.parse(localStorage.getItem('currentUser')).userInfo.userInfoSeq;
            //this.pwdChangeInfo.loginToken = JSON.parse(localStorage.getItem('currentUser')).loginToken;

            if(this.userInfoSeq){
                //console.log("this.userInfoSeq", this.userInfoSeq);
                this.pwdChangeInfo.userInfoSeq = this.userInfoSeq;
            }

            if(this.loginToken){
                this.pwdChangeInfo.loginToken = this.loginToken;
            }

            this.pwdChangeInfo.newUserPwd = this.passwordForm.value.passwordCheck;
            this.spinner.show();
            this.userService.userPwdChange(this.pwdChangeInfo)
                .subscribe(data => {
                    // console.log("data : " + JSON.stringify(data));
                    // console.log("data", data);
                    if (!data.error && data.message == "user_pwd_update_success") {
                        this.spinner.hide();
                        this.editAlertPopup(this.commonService.getTranslateValue("SETTINGS.PW_TITLE"), this.commonService.getTranslateValue("SETTINGS.OK"));
                        setTimeout(() => {
                            this.closeModal(this.pwdChangeInfo);
                        }, 100);
                    } else {
                        this.spinner.hide();
                        if (data.message == "user_pwd_previous_same") {
                            this.editAlertPopup(this.commonService.getTranslateValue("SETTINGS.PW_TITLE"), this.commonService.getTranslateValue("SETTINGS.PW_PREV_ERROR"));
                        }
                        else {
                            this.editAlertPopup(this.commonService.getTranslateValue("SETTINGS.PW_TITLE"), this.commonService.getTranslateValue("SETTINGS.FAIL"));
                        }
                        setTimeout(() => {
                            this.closeModal(this.pwdChangeInfo);
                        }, 100);
                    }
                },
                    err => {
                        this.spinner.hide();
                        console.log("ERROR!: ", err);
                    });
        }
    }
}


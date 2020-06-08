import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from '../_services/upload.service';
import { AuthenticationService } from '../_services/authentication.service';


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}
@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.scss']
})
export class AddPortfolioComponent implements OnInit {
  userInfo: any;
  selectedFiles: FileList;
  constructor(
    public router: Router,
    private uploadService: UploadService,
    public authService: AuthenticationService,
  ) {
    if (this.authService.currentUserValue) {
      this.userInfo = this.authService.currentUserValue["userInfo"];
    }
   }

  ngOnInit() {
  }

  doCancel() {
    this.router.navigate(['/portfolio']);
  }

  upload() {
    const file = this.selectedFiles.item(0);
    this.uploadService.uploadFile(file, this.userInfo.nickName);
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
}

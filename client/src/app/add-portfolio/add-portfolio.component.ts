import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from '../_services/upload.service';


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
  selectedFiles: FileList;
  constructor(
    public router: Router,
    private uploadService: UploadService,
  ) { }

  ngOnInit() {
  }

  doCancel() {
    this.router.navigate(['/portfolio']);
  }

  upload() {
    const file = this.selectedFiles.item(0);
    this.uploadService.uploadFile(file);
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
}

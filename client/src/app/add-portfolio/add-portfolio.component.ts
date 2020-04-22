import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.scss']
})
export class AddPortfolioComponent implements OnInit {
  
  selectedFile: ImageSnippet;

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {
  }

  doCancel() {
    this.router.navigate(['/portfolio']);
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
          // if(this.selectedFile.src){
              // const fileType = this.selectedFile.file.type;
              // const findStr = "data:" + fileType + ";base64,";
              // this.userInfo.profilePhoto = this.selectedFile.src.replace(findStr, '');
          // }
      });
  
      reader.readAsDataURL(file);
  }
}

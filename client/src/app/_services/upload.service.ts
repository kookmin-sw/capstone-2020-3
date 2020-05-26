import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { ConfigService } from '../_services/config.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private aKey: string;
  private sKey: string;

  constructor(public config: ConfigService) {
    this.aKey = this.config.getConfig('accessKeyId');
    this.sKey = this.config.getConfig('secretAccessKey');
   }

  uploadFile(file) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: this.aKey,
        secretAccessKey: this.sKey,
        region: 'us-east-1'
      }
    );
    const params = {
      Bucket: 'portfoliosrc',
      Key: file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
    // for upload progress
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
              console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          }).send(function (err, data) {
              if (err) {
                  console.log('There was an error uploading your file: ', err);
                  return false;
              }
              console.log('Successfully uploaded file.', data);
              return true;
          });*/
  }
}

import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private resfulurl: Object = null;
  private config: Object = null;
  private env:    Object = null;

  constructor(private http: HttpClient) {

  }

  public getRestfulUrl(keyArray: any) {
    let tempVal: any = "";
    let res = keyArray.split(".");
    if(res.length > 0){
        for(let key of res) {
            if(tempVal == ""){
                tempVal = this.resfulurl[key];
            }else{
                if(typeof(tempVal) === "object"){
                    tempVal = tempVal[key];
                }
            }
        } 
    }
    return tempVal;
  }

  /**
   * Use to get the data found in the second file (config file)
   */
  public getConfig(key: any) {
    return this.config[key];
  }

  /**
   * Use to get the data found in the first file (env file)
   */
  public getEnv(key: any) {
    return this.env[key];
  }

  /**
   * This method:
   *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
   *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
   */
  public load() {
    return new Promise((resolve, reject) => {
        this.http.get('../assets/config/env.json').map( res => res ).catch((error: any):any => {
            console.log('Configuration file "env.json" could not be read');
            resolve(true);
            return Observable.throw(error.json().error || 'Server error');
        }).subscribe( (envResponse: any) => {
            this.env = envResponse;
            //console.log("envResponse", envResponse["ENV"]);
            let request:any = null;

            switch (envResponse["ENV"]) {
                case 'default': {
                    request = this.http.get('../assets/config/config.' + envResponse["ENV"] + '.json');
                } break;

                case 'project': {
                    request = this.http.get('../assets/config/config.' + envResponse["ENV"] + '.json');
                } break;

                case 'none': {
                    console.error('Environment file is not set or invalid');
                    resolve(true);
                } break;
            }

            if (request) {
                request
                    .map( res => res )
                    .catch((error: any) => {
                        console.error('Error reading ' + envResponse.env + ' configuration file');
                        resolve(error);
                        return Observable.throw(error.json().error || 'Server error');
                    })
                    .subscribe((responseData) => {
                        //console.log("responseData", responseData);
                        this.config = responseData;
                        let rest_request:any = this.http.get('../assets/config/config.restful.url.json');
                        if(rest_request){
                            rest_request.map(res => res).catch((error: any) => {
                                console.error('Error reading config.restful.url configuration file');
                                resolve(error);
                                return Observable.throw(error.json().error || 'Server error');
                            }).subscribe((responseData) => {
                                /*if(typeof(responseData) === "object"){
                                    let tempStr = JSON.stringify(responseData);
                                    this.resfulurl = JSON.parse(tempStr);
                                    console.log("type", typeof(tempStr));
                                }*/
                                this.resfulurl = responseData;
                                
                                resolve(true);
                            });    
                        }else{
                            console.error('Restful url file is not set or invalid');
                            resolve(true);
                        }
                    });
            } else {
                console.error('Env config file "env.json" is not valid');
                resolve(true);
            }
        });

    });
  }
}

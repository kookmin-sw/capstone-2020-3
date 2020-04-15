import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ConfigService } from '../_services/config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private restApiKey: string;
  
  private apiUrl: string;
  private baseUrlPrefix: string;

  constructor(
    private http: HttpClient,
    public config: ConfigService
  ) {
    this.restApiKey = this.config.getConfig("RESTFUL_API_KEY");
    this.apiUrl = this.config.getEnv("BASE_URL").API_SITE;
    this.baseUrlPrefix = this.config.getRestfulUrl("BASE_URL.PREFIX");

    //console.log("restApiKey", this.restApiKey);
    //console.log("apiUrl", apiUrl);
  }

  /**
   * 회원가입
   * @param signupInfo 
   */
  public joinUserProc(signupInfo : any){
    if(signupInfo){
      signupInfo["restApiKey"] = this.restApiKey;
      
      /*let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let body = JSON.stringify(signupInfo);

      let url = this.apiUrl + this.baseUrlPrefix + this.config.getRestfulUrl("RESTFUL_URL.USER.DEFAULT");
      return this.http.post(url, body, options)
        .do(this.logResponse)
        .map(this.extractData)
        .catch(handleError);*/
      // console.log(signupInfo);

      const url = this.apiUrl + this.baseUrlPrefix + this.config.getRestfulUrl("RESTFUL_URL.USER.DEFAULT");
      const options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      }

      return this.http.post<any>(url, signupInfo, options)
        .pipe(
          catchError(this.handleError('joinUserProc', null))
        );
    }
  }

  /**
   * 회원정보 수정
   * @param profileInfo 
   */
  public editUserProc(profileInfo: any) {
    if (profileInfo) {
      profileInfo["restApiKey"] = this.restApiKey;

      const url = this.apiUrl + this.baseUrlPrefix + this.config.getRestfulUrl("RESTFUL_URL.USER.DEFAULT")
       + "/" + profileInfo["userInfoSeq"];
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      // console.log(profileInfo);

      return this.http.put<any>(url, profileInfo, options)
        .pipe(
          catchError(this.handleError('editUserProc', null))
        );
    }
  }

  /**
   * 비밀번호변경
   * @param pwdChangeInfo
   */
  userPwdChange(pwdChangeInfo: any) {
    if (pwdChangeInfo) {
      pwdChangeInfo["restApiKey"] = this.restApiKey;
      const url = this.apiUrl + this.baseUrlPrefix + this.config.getRestfulUrl("RESTFUL_URL.USER.PW_CHANGE");
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      return this.http.post<any>(url, pwdChangeInfo, options)
        .pipe(
          catchError(this.handleError('UserPwdChange', null))
        );
    }
  }

  /**
   * 전체 회원 정보가져오기
   * @param paramData 
   */
  getAllUsers(paramData : any){
    if(paramData){
      const url = this.apiUrl + this.baseUrlPrefix + this.config.getRestfulUrl("RESTFUL_URL.USER.DEFAULT");
      let params = "restApiKey=" + this.restApiKey + "&userInfoSeq=" + paramData["userInfoSeq"] + "&searchInfo=" + paramData["searchInfo"];
      params = params + "&offset=" + paramData["offset"] + "&limit=" + paramData["limit"];
      //console.log(url + "?" + params);
      return this.http.get<any>(url + "?" + params)
        .pipe(
          tap(_ => this.log('fetched total user data')),
          catchError(this.handleError('getAllUsers', []))
        );
    }
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }

}

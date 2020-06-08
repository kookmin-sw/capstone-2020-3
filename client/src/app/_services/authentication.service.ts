import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ConfigService } from '../_services/config.service';

import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private restApiKey: string;
  
  private apiUrl: string;
  private baseUrlPrefix: string;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, public config: ConfigService) {
    this.restApiKey = this.config.getConfig("RESTFUL_API_KEY");
    this.apiUrl = this.config.getEnv("BASE_URL").API_SITE;
    this.baseUrlPrefix = this.config.getRestfulUrl("BASE_URL.PREFIX");

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * alice 작업
   */
  makeAlice(paramData: any) {
    if(paramData){
      const url = 'http://secret:port'; // config code
      const params = paramData;
      return this.http.get<any>(url + "/pdfToImage/final/" + paramData)
        .pipe(
          tap(_ => this.log('pdf To Image')),
          catchError(this.handleError('Error pdf To Image', []))
        );
    }
  }


  /**
   * pdfToImage 작업
   */
  pdfToImage(paramData: any) {
    if(paramData){
      const url = 'http://secret:port'; // config code
      const params = paramData;
      return this.http.get<any>(url + "/pdfToImage/" + paramData)
        .pipe(
          tap(_ => this.log('pdf To Image')),
          catchError(this.handleError('Error pdf To Image', []))
        );
    }
  }

  /**
   * 포트폴리오 top5 만들기
   */
  makeTop5Data(paramData: any) {
    if(paramData){
      const url = 'http://secret:code'; // config code
      const params = paramData;
      return this.http.get<any>(url + "/" + paramData)
        .pipe(
          tap(_ => this.log('fetched Top5 data')),
          catchError(this.handleError('Error Top5 data', []))
        );
    }
  }

  /**
   * eyetracking 좌표보내기
   * @param paramData 
   */
  postEyetrackingData(paramData: any) {
    if(paramData){
      const url = 'http://secret:code/'; // config code
      const options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      return this.http.post<any>(url, paramData, options)
        .pipe(
          catchError(this.handleError('postEyetrackingData', null))
        );
    }
  }

  /**
   * eyetracking png로 만들기
   * @param paramData
   */
  makeEyetrackingPng(paramData: any) {
    console.log(paramData);
    if(paramData){
      const url = 'secret/code'; // config code
      const options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      console.log(url);

      return this.http.post<any>(url, paramData)
        .pipe(
          catchError(this.handleError('makeEyetrackingPng', null))
        );
    }
  }


  /**
   * 로그인
   * @param userId 
   * @param userPwd 
   * @param loginRouteType : 로그인 경로(email-기본, fb, googlep, kakaotalk, other)
   */
  login(userId:string, userPwd:string, loginRouteType:string){
    if(userId && loginRouteType){
      const url = this.apiUrl + this.baseUrlPrefix + this.config.getRestfulUrl("RESTFUL_URL.USER.LOGIN");
      const options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      }

      const loginInfo = {
        "restApiKey": this.restApiKey,
        "userId": userId,
        "userPwd": userPwd,
        "loginRouteType": loginRouteType
      }

      return this.http.post<any>(url, loginInfo, options)
        .pipe(map(user => {
          if (user && user.loginToken) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
          }
          return user;
          //catchError(this.handleError('login', null))
        })
      );

    }
  }

  /**
   * 로그아웃
   */
  logout() {
    // remove user from local storage to log user out
    // 
    // 

    if(this.currentUserSubject.value){
      const url = this.apiUrl + this.baseUrlPrefix + this.config.getRestfulUrl("RESTFUL_URL.USER.LOGOUT");
      const options = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      }

      const logoutInfo = {
        "restApiKey": this.restApiKey,
        "loginToken": this.currentUserSubject.value.loginToken
      }

      return this.http.post<any>(url, logoutInfo, options)
        .pipe(map(data => {
          //console.log("data", data);
          if(!data.error){
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next(null);
          }
          return data;
        })
      );
    }

  }

  /**
   * 로그인한 사용자 정보 업데이트
   * @param userInfo 
   */
  updateCurrentUserInfo(userInfo: any){
    if(userInfo) {
      localStorage.removeItem('currentUser');
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      return true;
    }else {
      return false;
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


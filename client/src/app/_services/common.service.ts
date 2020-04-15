import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '../_services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private restfulApiKey: string;
  private kakaoRestfulApiKey: string;

  private protocol:string;
  private host:string;
  private baseUrlPrefix:string;
  
  constructor(
    public http: HttpClient, 
    public translate: TranslateService,
    public config: ConfigService
  ) {
    this.restfulApiKey = this.config.getConfig("RESTFUL_API_KEY");
    this.kakaoRestfulApiKey = this.config.getConfig("KAKAO_RESTFUL_API_KEY");

    this.protocol = this.config.getConfig("PROTOCOL");
    this.host = this.config.getConfig("HOST");
    this.baseUrlPrefix = this.config.getRestfulUrl("BASE_URL.PREFIX");
  }

  /**
   * 언어 설정에 맞추어 strKey에 해당하는 문자 가져오기
   * @param strKey 
   */
  getTranslateValue(strKey:string){
    var translateValue:string = "";
    if(strKey != ""){
      this.translate.get(strKey).subscribe(
        value => {
          // value is our translated string
          translateValue = value;
        }
      );
    }
    return translateValue;
  }

  getLocaleLanguage(){
    let userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang = /(en|ko)/gi.test(userLang) ? userLang : 'en';

    return userLang;
  }

  getRestfulApiKey() {
    return this.restfulApiKey;
  }

  getProtocol() {
    return this.protocol;
  }

  getHost() {
    return this.host;
  }

  getBaseUrlPrefix() {
    return this.baseUrlPrefix;
  }

}

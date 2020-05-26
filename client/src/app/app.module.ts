import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { GtagModule } from 'angular-gtag';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartsModule } from 'ng2-charts';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app.routing';
import { ConfigService } from './_services/config.service';
import { CommonService } from './_services/common.service';
import { AlertService } from './_services/alert.service';
import { UserService } from './_services/user.service';
import { AuthenticationService } from './_services/authentication.service';
import { UploadService } from './_services/upload.service';
import { PipesModule } from './_pipes/pipes.module';
import { HomeModule } from './home/home.module';
import { AppComponent } from './app.component';
import { SignupComponent, SignUpMsgModalContent } from './signup/signup.component';
import { ProfileComponent, ProfileMsgModalContent, AlertModalContent, ChangePasswordModalContent } from './profile/profile.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SigninComponent } from './signin/signin.component';
import { AlertComponent } from './alert/alert.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ViewPortfolioComponent } from './view-portfolio/view-portfolio.component';
import { AddPortfolioComponent } from './add-portfolio/add-portfolio.component';

// required for AOT compilation
export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SignUpMsgModalContent,
    ProfileComponent,
    ProfileMsgModalContent,
    AlertModalContent,
    ChangePasswordModalContent,
    NavbarComponent,
    FooterComponent,
    SigninComponent,
    AlertComponent,
    PortfolioComponent,
    ViewPortfolioComponent,
    AddPortfolioComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxSpinnerModule,
    ChartsModule,
    JwBootstrapSwitchNg2Module,
    GtagModule.forRoot({ trackingId: 'UA-139454993-2', trackPageviews: true }),
    DeviceDetectorModule.forRoot(),
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    PipesModule,
    HomeModule,
    NgxPaginationModule,
    BrowserAnimationsModule
  ],
  providers: [
    NgbActiveModal,
    DatePipe,
    DecimalPipe,
    CookieService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true
    },
    CommonService,
    AlertService,
    UserService,
    AuthenticationService,
    UploadService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SignUpMsgModalContent,
    ProfileMsgModalContent,
    AlertModalContent,
    ChangePasswordModalContent,
  ]
})
export class AppModule { }

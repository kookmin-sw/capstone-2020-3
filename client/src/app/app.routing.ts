import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard, AdminAuthGuard } from './_guards';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ViewPortfolioComponent } from './view-portfolio/view-portfolio.component';
import { AddPortfolioComponent } from './add-portfolio/add-portfolio.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'view-portfolio', component: ViewPortfolioComponent},
  { path: 'add-portfolio', component: AddPortfolioComponent },
  { path: 'update/user-view-device/:deviceSettingInfoSeq', redirectTo: 'user-view-device/:deviceSettingInfoSeq' },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


import { authInterceptorProviders } from './helpers/auth.interceptor';
import { ProfileComponent } from './components/profile/profile.component';
import { BloodpressureComponent } from './components/bloodpressure/bloodpressure.component';
import { CaloriesComponent } from './components/calories/calories.component';
import { WeightComponent } from './components/weight/weight.component';
import { RouteComponent } from './components/route/route.component';
import { UserComponent } from './components/user/user.component';
import { HeartrateComponent } from './components/heartrate/heartrate.component';
import { BarComponent } from './components/bar/bar.component';
import { HomeComponent } from './components/home/home.component';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    BloodpressureComponent,
    CaloriesComponent,
    WeightComponent,
    RouteComponent,
    UserComponent,
    HeartrateComponent,
    BarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

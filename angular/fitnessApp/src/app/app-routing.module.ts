import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BloodpressureComponent } from './components/bloodpressure/bloodpressure.component';
import { CaloriesComponent } from './components/calories/calories.component';
import { HeartrateComponent } from './components/heartrate/heartrate.component';
import { RouteComponent } from './components/route/route.component';
import { WeightComponent } from './components/weight/weight.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'bloodpressure', component: BloodpressureComponent },
  { path: 'calorie', component: CaloriesComponent}, 
  { path: 'heartrate', component: HeartrateComponent}, 
  { path: 'route', component: RouteComponent}, 
  { path: 'weight', component: WeightComponent}, 

]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

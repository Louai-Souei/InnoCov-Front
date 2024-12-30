import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaskComponent} from './components/task/task.component';
import {LoginComponent} from './components/auth/login/login.component';
import {authGuard} from './services/auth/guard/auth.guard';
import {RegisterComponent} from './components/auth/register/register.component';
import {DriverLayoutComponent} from './layouts/driver-layout/driver-layout.component';
import {PassengerLayoutComponent} from "./layouts/passenger-layout/passenger-layout.component";
import {AdminLayoutComponent} from "./layouts/admin-layout/admin-layout.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'driver',
    component: DriverLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: 'tasks', component: TaskComponent},
      {path: 'profile', component: LoginComponent},
      {path: 'about', component: RegisterComponent},
    ],
  },
  {
    path: 'passenger',
    component: PassengerLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: 'tasks', component: TaskComponent},
      {path: 'profile', component: LoginComponent},
      {path: 'about', component: RegisterComponent},
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: 'tasks', component: TaskComponent},
      {path: 'profile', component: LoginComponent},
      {path: 'about', component: RegisterComponent},
    ],
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

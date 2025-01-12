import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TaskComponent} from './components/task/task.component';
import {LoginComponent} from './components/auth/login/login.component';
import {authGuard} from './services/auth/guard/auth.guard';
import {RegisterComponent} from './components/auth/register/register.component';
import {DriverLayoutComponent} from './layouts/driver-layout/driver-layout.component';
import {PassengerLayoutComponent} from "./layouts/passenger-layout/passenger-layout.component";
import {AdminLayoutComponent} from "./layouts/admin-layout/admin-layout.component";
import {AvailableRoutesComponent} from "./components/passenger/routes/available-routes.component";
import {BookedRoutesComponent} from "./components/passenger/booked-routes/booked-routes.component";
import {UserProfileComponent} from "./components/user/user-profile/user-profile.component";
import { MyRoutesComponent } from './components/Driver/my-routes/my-routes.component';
import {DriverBookingComponent} from "./components/Driver/driver-booking/driver-booking.component";
import {AdminStatsComponent} from "./components/Admin/admin-stats/admin-stats.component";
import {UserStatsComponent} from "./components/admin/user-stats/user-stats.component";
import {DriverStatsComponent} from "./components/admin/driver-stats/driver-stats.component";
import {PassengerStatsComponent} from "./components/admin/passenger-stats/passenger-stats.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'driver',
    component: DriverLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: 'tasks', component: TaskComponent},
      {path: 'profile', component: UserProfileComponent},
      {path: 'about', component: RegisterComponent},
      { path: 'MyRoutes', component: MyRoutesComponent },
      { path: 'MyBooking', component: DriverBookingComponent },
      {path: 'profile', component: LoginComponent},



    ],
  },
  {
    path: 'passenger',
    component: PassengerLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: 'available-routes', component: AvailableRoutesComponent},
      {path: 'booked-routes', component: BookedRoutesComponent},
      {path: 'profile', component: UserProfileComponent},
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: 'dashboard', component: AdminStatsComponent},
      {path: 'profile', component: UserProfileComponent},
      {path: 'about', component: RegisterComponent},
      {path: 'users-stats', component: UserStatsComponent},
      {path: 'drivers-stats', component: DriverStatsComponent},
      {path: 'passengers-stats', component: PassengerStatsComponent},
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './components/task/task.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './services/auth/guard/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'tasks', component: TaskComponent },
      { path: 'profile', component: LoginComponent },
      { path: 'about', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

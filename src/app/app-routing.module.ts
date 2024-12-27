import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskComponent} from "./components/task/task.component";
import {LoginComponent} from "./components/login/login.component";
import {authGuard} from "./services/auth/guard/auth.guard";
import {RegisterComponent} from "./components/register/register.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";


const routes: Routes = [
  { path: 'tasks', component: TaskComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sidebar', component: SidebarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

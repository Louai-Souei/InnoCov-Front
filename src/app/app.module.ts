import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ButtonDirective, ButtonModule} from 'primeng/button';
import {TableModule} from "primeng/table";
import { TaskComponent } from './components/task/task.component';
import { InputNumberModule} from "primeng/inputnumber";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { LoginComponent } from './components/login/login.component';
import {AuthInterceptorService} from "./services/auth/interceptor/auth-interceptor.service";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {ToastModule} from "primeng/toast";
import {PasswordModule} from "primeng/password";
import { RegisterComponent } from './components/register/register.component';
import {DropdownModule} from "primeng/dropdown";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {SidebarModule} from "primeng/sidebar";
import {AvatarModule} from "primeng/avatar";
import {Ripple} from "primeng/ripple";
import {StyleClassModule} from "primeng/styleclass";
import {MenubarModule} from "primeng/menubar";

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    TableModule,
    ButtonDirective,
    InputNumberModule,
    InputTextModule,
    FormsModule,
    BrowserAnimationsModule,
    CardModule,
    ReactiveFormsModule,
    DividerModule,
    ToastModule,
    PasswordModule,
    DropdownModule,
    SidebarModule,
    AvatarModule,
    Ripple,
    StyleClassModule,
    MenubarModule,
  ],
  providers: [
//    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide : HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

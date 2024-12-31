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
import { LoginComponent } from './components/auth/login/login.component';
import {AuthInterceptorService} from "./services/auth/interceptor/auth-interceptor.service";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {ToastModule} from "primeng/toast";
import {PasswordModule} from "primeng/password";
import { RegisterComponent } from './components/auth/register/register.component';
import {DropdownModule} from "primeng/dropdown";
import {SidebarModule} from "primeng/sidebar";
import {AvatarModule} from "primeng/avatar";
import {Ripple} from "primeng/ripple";
import {StyleClassModule} from "primeng/styleclass";
import {MenubarModule} from "primeng/menubar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import { DriverLayoutComponent } from './layouts/driver-layout/driver-layout.component';
import { PassengerLayoutComponent } from './layouts/passenger-layout/passenger-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { RoutesComponent } from './components/passenger/routes/routes.component';
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {TagModule} from "primeng/tag";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    LoginComponent,
    RegisterComponent,
    DriverLayoutComponent,
    PassengerLayoutComponent,
    AdminLayoutComponent,
    RoutesComponent,

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
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    DialogModule,
    CalendarModule,
  ],
  providers: [
//    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide : HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable } from '@angular/core';
import { AppSettings } from "../../../settings/app-settings";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationRequest } from "../../../util/AuthenticationRequest";
import {AuthenticationResponse} from "../../../util/AuthenticationResponse";
import {RegisterRequest} from "../../../util/RegisterRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiUrl: string = AppSettings.API_ENDPOINT + 'auth/';
  private token = 'authToken';

  constructor(private http: HttpClient) { }

  setToken(token: string): void {
    localStorage.setItem(this.token, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.token);
  }

  clearToken(): void {
    localStorage.removeItem(this.token);
  }

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(this.apiUrl + "login", request);
  }

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    console.log(request);
    return this.http.post<AuthenticationResponse>(this.apiUrl + "register", request);
  }
}


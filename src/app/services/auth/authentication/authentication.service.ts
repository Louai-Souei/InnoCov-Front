import { Injectable } from '@angular/core';
import { AppSettings } from "../../../settings/app-settings";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationRequest } from "../../../util/AuthenticationRequest";
import { AuthenticationResponse } from "../../../util/AuthenticationResponse";
import { RegisterRequest } from "../../../util/RegisterRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUrl: string = AppSettings.API_ENDPOINT + 'auth/';
  private token: string = 'authToken';
  private userId: string = 'userId';
  private role: string = 'role';
  private email: string = 'email';
  private occupation: string = 'occupation';

  constructor(private http: HttpClient) {}

  setUserInformations(data: AuthenticationResponse): void {
    this.setToken(data.access_token);
    this.setUserExtraInformations(data);
  }

  private setUserExtraInformations(data: AuthenticationResponse) {
    localStorage.setItem(this.userId, String(data.userId));
    localStorage.setItem(this.email, data.email);
    localStorage.setItem(this.role, data.role);
    localStorage.setItem(this.occupation, data.occupation);
  }

  setToken(token: string): void {
    localStorage.setItem(this.token, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.token);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  register(request: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(this.apiUrl + "register", request);
  }

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(this.apiUrl + "login", request);
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.apiUrl + "logout", {});
  }
}

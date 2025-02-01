import {Injectable} from '@angular/core';
import {AppSettings} from "../../../settings/app-settings";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationRequest} from "../../../util/AuthenticationRequest";
import {AuthenticationResponse} from "../../../util/AuthenticationResponse";
import {ApiResponse} from "../../utils/models/ApiResponse";

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

  setUserInformation(data: AuthenticationResponse): void {
    this.setToken(data.access_token);
    this.setUserExtraInformation(data);
  }

  private setUserExtraInformation(data: AuthenticationResponse) {
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

  getUserId(): string | null {
    return localStorage.getItem(this.userId);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  register(formData: FormData): Observable<ApiResponse<AuthenticationResponse>> {
    return this.http.post<ApiResponse<AuthenticationResponse>>(this.apiUrl + "register", formData);
  }

  login(request: AuthenticationRequest): Observable<ApiResponse<AuthenticationResponse>> {
    return this.http.post<ApiResponse<AuthenticationResponse>>(this.apiUrl + "login", request);
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.apiUrl + "logout", {});
  }

  getActiveUserInformation(): any {
    return {
      userId: localStorage.getItem(this.userId),
      email: localStorage.getItem(this.email),
      role: localStorage.getItem(this.role),
      occupation: localStorage.getItem(this.occupation),
    };
  }
}

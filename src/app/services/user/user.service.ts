import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from "../../settings/app-settings";
import { User } from "../../entity/User";
import {ApiResponse} from "../utils/models/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = AppSettings.API_ENDPOINT + 'user/';

  constructor(private http: HttpClient) {}

  getActiveUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}active`);
  }

  getUserById(userId: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}get-by-id/${userId}`);
  }

  updateUserProfile(user: User): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}update-profile`, user);
  }
}

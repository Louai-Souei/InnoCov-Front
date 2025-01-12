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

  updateUserProfile(formData: FormData): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}update-profile`, formData);
  }

  activateUser(userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}activate/${userId}`, {});
  }

  deactivateUser(userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}deactivate/${userId}`, {});
  }

  getUserCreationStatsForLast4Weeks(): Observable<ApiResponse<Map<string, number>>> {
    return this.http.get<ApiResponse<Map<string, number>>>(`${this.apiUrl}creation-stats`);
  }

  getActiveUsersStatsForLast4Weeks(): Observable<ApiResponse<Map<string, number>>> {
    return this.http.get<ApiResponse<Map<string, number>>>(`${this.apiUrl}active-users-stats`);
  }

}

import { Injectable } from '@angular/core';
import { AppSettings } from "../../settings/app-settings";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Route } from "../../entity/Route";
import {ApiResponse} from "../utils/models/ApiResponse";

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private apiUrl: string = AppSettings.API_ENDPOINT + 'route/';

  constructor(private http: HttpClient) {}

  addRoute(route: Partial<Route>): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}new-route`, route);
  }

  getRouteInformation(routeId: number): Observable<Route> {
    return this.http.get<Route>(`${this.apiUrl}route-information/${routeId}`);
  }

  getAvailableRoutes(selectedDate: Date | null): Observable<Route[]> {
    let params = new HttpParams();
    if (selectedDate) {
      params = params.set('date', selectedDate.toDateString());
    }
    return this.http.get<Route[]>(`${this.apiUrl}available`, { params });
  }
  getDriverCreatedRoutesStatsForLast4Weeks(): Observable<ApiResponse<Map<string, number>>> {
    return this.http.get<ApiResponse<Map<string, number>>>(`${this.apiUrl}user-creation-stats`);
  }

  getRouteCreationStatsForLast4Weeks(): Observable<ApiResponse<Map<string, number>>> {
    return this.http.get<ApiResponse<Map<string, number>>>(`${this.apiUrl}routes-creation-stats`);
  }

}

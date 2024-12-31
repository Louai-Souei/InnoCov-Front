import { Injectable } from '@angular/core';
import { AppSettings } from "../../settings/app-settings";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Route } from "../../entity/Route"

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

  getAvailableRoutes(): Observable<Route[]> {
    return this.http.get<Route[]>(`${this.apiUrl}available`);
  }
}

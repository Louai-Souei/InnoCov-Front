import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../../settings/app-settings';
import { Route } from '../../entity/Route';
import {ApiResponse} from "../utils/models/ApiResponse";
@Injectable({
  providedIn: 'root',
})
export class RouteBookingService {
  private apiUrl = AppSettings.API_ENDPOINT + 'route-booking/';

  constructor(private http: HttpClient) {}

  addBooking(routeId: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}new-booking/${routeId}`, null);
  }

  getAvailableSeats(routeId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}available-seats/${routeId}`);
  }

  getUserBookedRoutes(): Observable<ApiResponse<Route[]>> {
    return this.http.get<ApiResponse<Route[]>>(`${this.apiUrl}routes-booked`);
  }

  getPassengersReservedRoutesStatsForLast4Weeks(): Observable<ApiResponse<Map<string, number>>> {
    return this.http.get<ApiResponse<Map<string, number>>>(`${this.apiUrl}user-creation-stats`);
  }

  getRouteBookingsCreationStatsForLast4Weeks(): Observable<ApiResponse<Map<string, number>>> {
    return this.http.get<ApiResponse<Map<string, number>>>(`${this.apiUrl}route-bookings-creation-stats`);
  }
}

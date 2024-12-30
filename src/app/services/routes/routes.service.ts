import {Injectable} from '@angular/core';
import {AppSettings} from "../../settings/app-settings";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  apiUrl: string = AppSettings.API_ENDPOINT + 'complaint/complaints-by-complainer';

  constructor(private http: HttpClient) {
  }

  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

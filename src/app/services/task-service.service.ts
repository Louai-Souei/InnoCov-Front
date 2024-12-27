import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Task} from "../entity/Task";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../settings/app-settings";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiUrl:string = AppSettings.API_ENDPOINT + 'complaint/complaints-by-complainer';

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

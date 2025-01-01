import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../../settings/app-settings';
import { ApiResponse } from '../utils/models/ApiResponse';
import {Complaint} from "../../entity/Complaint";
@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = AppSettings.API_ENDPOINT + 'complaint/';

  constructor(private http: HttpClient) {}

  addComplaint(Complaint: Complaint): Observable<ApiResponse<Complaint>> {
    return this.http.post<ApiResponse<Complaint>>(`${this.apiUrl}new-complaint`, Complaint);
  }

  getComplaintsByTargetUser(targetUserId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}complaints-by-target/${targetUserId}`);
  }

  getComplaintsByComplainer(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}complaints-by-complainer`);
  }

  resolveComplaint(complaintId: number): Observable<ApiResponse<Complaint>> {
    return this.http.patch<ApiResponse<Complaint>>(`${this.apiUrl}resolve-complaint/${complaintId}`, null);
  }
}

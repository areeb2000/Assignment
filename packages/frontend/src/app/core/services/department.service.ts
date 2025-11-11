import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, DepartmentResponse, CreateDepartmentRequest } from '../models/department.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<DepartmentResponse> {
    return this.http.get<DepartmentResponse>(this.apiUrl);
  }

  getDepartment(id: number): Observable<{ success: boolean; data: { department: Department } }> {
    return this.http.get<{ success: boolean; data: { department: Department } }>(`${this.apiUrl}/${id}`);
  }

  createDepartment(department: CreateDepartmentRequest): Observable<{ success: boolean; data: { department: Department }; message: string }> {
    return this.http.post<{ success: boolean; data: { department: Department }; message: string }>(this.apiUrl, department);
  }

  updateDepartment(id: number, department: Partial<Department>): Observable<{ success: boolean; data: { department: Department }; message: string }> {
    return this.http.put<{ success: boolean; data: { department: Department }; message: string }>(`${this.apiUrl}/${id}`, department);
  }

  deleteDepartment(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
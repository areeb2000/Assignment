import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeResponse, CreateEmployeeRequest } from '../models/employee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getEmployees(filters?: any): Observable<EmployeeResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<EmployeeResponse>(this.apiUrl, { params });
  }

  getEmployee(id: number): Observable<{ success: boolean; data: { employee: Employee } }> {
    return this.http.get<{ success: boolean; data: { employee: Employee } }>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: CreateEmployeeRequest): Observable<{ success: boolean; data: { employee: Employee }; message: string }> {
    return this.http.post<{ success: boolean; data: { employee: Employee }; message: string }>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<{ success: boolean; data: { employee: Employee }; message: string }> {
    return this.http.put<{ success: boolean; data: { employee: Employee }; message: string }>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  searchEmployees(searchTerm: string): Observable<EmployeeResponse> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<EmployeeResponse>(this.apiUrl, { params });
  }

  getEmployeesByDepartment(departmentId: number): Observable<EmployeeResponse> {
    const params = new HttpParams().set('department_id', departmentId.toString());
    return this.http.get<EmployeeResponse>(this.apiUrl, { params });
  }

  getEmployeesByStatus(status: string): Observable<EmployeeResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.get<EmployeeResponse>(this.apiUrl, { params });
  }
}
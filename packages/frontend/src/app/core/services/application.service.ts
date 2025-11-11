import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Application {
  id?: number;
  application_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_role_id: number;
  job_title?: string;
  department_name?: string;
  experience_years: number;
  resume_url?: string;
  cover_letter?: string;
  status: 'new' | 'screening' | 'interview_scheduled' | 'interviewed' | 'rejected' | 'hired' | 'withdrawn';
  applied_date: string;
  interview_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationFilters {
  job_role_id?: number;
  status?: string;
  department_id?: number;
  search?: string;
}

export interface JobRole {
  id: number;
  title: string;
  description?: string;
  department_id: number;
  department_name?: string;
}

export interface ApplicationStats {
  total: number;
  new: number;
  screening: number;
  interview_scheduled: number;
  interviewed: number;
  hired: number;
  rejected: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/applications`;
  private readonly jobRolesUrl = `${environment.apiUrl}/job-roles`;

  private applicationsSubject = new BehaviorSubject<Application[]>([]);
  public applications$ = this.applicationsSubject.asObservable();

  private statsSubject = new BehaviorSubject<ApplicationStats>({
    total: 0, new: 0, screening: 0, interview_scheduled: 0,
    interviewed: 0, hired: 0, rejected: 0
  });
  public stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all applications with optional filters
  getApplications(filters?: ApplicationFilters): Observable<Application[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.job_role_id) params = params.set('job_role_id', filters.job_role_id.toString());
      if (filters.status) params = params.set('status', filters.status);
      if (filters.department_id) params = params.set('department_id', filters.department_id.toString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<{success: boolean, data: {applications: Application[]}}>(`${this.apiUrl}`, { params })
      .pipe(
        map(response => response.data.applications),
        tap(applications => {
          this.applicationsSubject.next(applications);
          this.updateStats(applications);
        })
      );
  }

  // Get application by ID
  getApplicationById(id: number): Observable<Application> {
    return this.http.get<{success: boolean, data: {application: Application}}>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data.application));
  }

  // Create new application
  createApplication(applicationData: Omit<Application, 'id' | 'application_id'>): Observable<Application> {
    return this.http.post<{success: boolean, data: {application: Application}}>(`${this.apiUrl}`, applicationData)
      .pipe(
        map(response => response.data.application),
        tap(() => this.refreshApplications())
      );
  }

  // Update application
  updateApplication(id: number, applicationData: Partial<Application>): Observable<Application> {
    return this.http.put<{success: boolean, data: {application: Application}}>(`${this.apiUrl}/${id}`, applicationData)
      .pipe(
        map(response => response.data.application),
        tap(() => this.refreshApplications())
      );
  }

  // Delete application
  deleteApplication(id: number): Observable<void> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => void 0),
        tap(() => this.refreshApplications())
      );
  }

  // Get applications by job categories
  getApplicationsByCategories(): Observable<any> {
    return this.http.get<{success: boolean, data: any}>(`${this.apiUrl}/categories`);
  }

  // Get available job roles
  getJobRoles(): Observable<JobRole[]> {
    return this.http.get<{success: boolean, data: {job_roles: JobRole[]}}>(`${this.jobRolesUrl}`)
      .pipe(map(response => response.data.job_roles));
  }

  // Update application status
  updateApplicationStatus(id: number, status: Application['status'], notes?: string): Observable<Application> {
    const updateData: any = { status };
    if (notes) updateData.notes = notes;
    
    return this.updateApplication(id, updateData);
  }

  // Schedule interview
  scheduleInterview(id: number, interview_date: string, notes?: string): Observable<Application> {
    const updateData: any = { 
      status: 'interview_scheduled', 
      interview_date 
    };
    if (notes) updateData.notes = notes;
    
    return this.updateApplication(id, updateData);
  }

  // Get status options for dropdown
  getStatusOptions(): Array<{value: Application['status'], label: string, color: string}> {
    return [
      { value: 'new', label: 'New Application', color: '#3182ce' },
      { value: 'screening', label: 'Under Screening', color: '#d69e2e' },
      { value: 'interview_scheduled', label: 'Interview Scheduled', color: '#805ad5' },
      { value: 'interviewed', label: 'Interviewed', color: '#319795' },
      { value: 'hired', label: 'Hired', color: '#38a169' },
      { value: 'rejected', label: 'Rejected', color: '#e53e3e' },
      { value: 'withdrawn', label: 'Withdrawn', color: '#718096' }
    ];
  }

  // Get status color for UI
  getStatusColor(status: Application['status']): string {
    const statusOption = this.getStatusOptions().find(option => option.value === status);
    return statusOption?.color || '#718096';
  }

  // Get status label for UI
  getStatusLabel(status: Application['status']): string {
    const statusOption = this.getStatusOptions().find(option => option.value === status);
    return statusOption?.label || status;
  }

  // Private method to refresh applications
  private refreshApplications(): void {
    this.getApplications().subscribe();
  }

  // Private method to update stats
  private updateStats(applications: Application[]): void {
    const stats: ApplicationStats = {
      total: applications.length,
      new: applications.filter(app => app.status === 'new').length,
      screening: applications.filter(app => app.status === 'screening').length,
      interview_scheduled: applications.filter(app => app.status === 'interview_scheduled').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      hired: applications.filter(app => app.status === 'hired').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
    
    this.statsSubject.next(stats);
  }

  // Clear applications cache
  clearCache(): void {
    this.applicationsSubject.next([]);
    this.statsSubject.next({
      total: 0, new: 0, screening: 0, interview_scheduled: 0,
      interviewed: 0, hired: 0, rejected: 0
    });
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { ApplicationService, Application, ApplicationFilters, JobRole, ApplicationStats } from '../../../core/services/application.service';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';
import { ApplicationFormComponent } from '../application-form/application-form.component';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit, OnDestroy {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  jobRoles: JobRole[] = [];
  departments: Department[] = [];
  stats: ApplicationStats = {
    total: 0, new: 0, screening: 0, interview_scheduled: 0,
    interviewed: 0, hired: 0, rejected: 0
  };
  
  loading = false;
  searchControl = new FormControl('');
  selectedDepartment = new FormControl('');
  selectedJobRole = new FormControl('');
  selectedStatus = new FormControl('');
  
  displayedColumns: string[] = [
    'application_id', 'candidate_name', 'job_title', 
    'department', 'experience', 'status', 'applied_date', 'actions'
  ];

  statusOptions = this.applicationService.getStatusOptions();
  
  private destroy$ = new Subject<void>();

  constructor(
    private applicationService: ApplicationService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSearchSubscription();
    this.setupFilterSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    this.loading = true;
    
    // Load applications
    this.applicationService.getApplications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applications) => {
          this.applications = applications;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.snackBar.open('Error loading applications', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });

    // Load job roles
    this.applicationService.getJobRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (jobRoles) => {
          this.jobRoles = jobRoles;
        },
        error: (error) => {
          console.error('Error loading job roles:', error);
        }
      });

    // Load departments
    this.departmentService.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.departments = response.data.departments || [];
        },
        error: (error) => {
          console.error('Error loading departments:', error);
        }
      });

    // Subscribe to stats
    this.applicationService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.stats = stats;
      });
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private setupFilterSubscriptions(): void {
    [this.selectedDepartment, this.selectedJobRole, this.selectedStatus].forEach(control => {
      control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.applyFilters();
        });
    });
  }

  private applyFilters(): void {
    let filtered = [...this.applications];
    
    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.application_id.toLowerCase().includes(searchTerm) ||
        `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchTerm) ||
        app.email.toLowerCase().includes(searchTerm) ||
        (app.job_title && app.job_title.toLowerCase().includes(searchTerm))
      );
    }

    // Department filter
    const departmentId = this.selectedDepartment.value;
    if (departmentId) {
      const departmentJobRoles = this.jobRoles
        .filter(jr => jr.department_id === parseInt(departmentId))
        .map(jr => jr.id);
      filtered = filtered.filter(app => departmentJobRoles.includes(app.job_role_id));
    }

    // Job role filter
    const jobRoleId = this.selectedJobRole.value;
    if (jobRoleId) {
      filtered = filtered.filter(app => app.job_role_id === parseInt(jobRoleId));
    }

    // Status filter
    const status = this.selectedStatus.value;
    if (status) {
      filtered = filtered.filter(app => app.status === status);
    }

    this.filteredApplications = filtered;
  }

  // Get available job roles for selected department
  getJobRolesForDepartment(): JobRole[] {
    const departmentId = this.selectedDepartment.value;
    if (!departmentId) {
      return this.jobRoles;
    }
    return this.jobRoles.filter(jr => jr.department_id === parseInt(departmentId));
  }

  openApplicationForm(application?: Application): void {
    const dialogRef = this.dialog.open(ApplicationFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { application, jobRoles: this.jobRoles },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInitialData();
      }
    });
  }

  updateApplicationStatus(application: Application, newStatus: Application['status']): void {
    this.applicationService.updateApplicationStatus(application.id!, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Application status updated successfully', 'Close', { duration: 3000 });
          this.loadInitialData();
        },
        error: (error) => {
          console.error('Error updating application status:', error);
          this.snackBar.open('Error updating application status', 'Close', { duration: 3000 });
        }
      });
  }

  scheduleInterview(application: Application): void {
    // This would open a date picker dialog
    const interviewDate = prompt('Enter interview date (YYYY-MM-DD):');
    if (interviewDate) {
      this.applicationService.scheduleInterview(application.id!, interviewDate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Interview scheduled successfully', 'Close', { duration: 3000 });
            this.loadInitialData();
          },
          error: (error) => {
            console.error('Error scheduling interview:', error);
            this.snackBar.open('Error scheduling interview', 'Close', { duration: 3000 });
          }
        });
    }
  }

  deleteApplication(application: Application): void {
    if (confirm(`Are you sure you want to delete application ${application.application_id}?`)) {
      this.applicationService.deleteApplication(application.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Application deleted successfully', 'Close', { duration: 3000 });
            this.loadInitialData();
          },
          error: (error) => {
            console.error('Error deleting application:', error);
            this.snackBar.open('Error deleting application', 'Close', { duration: 3000 });
          }
        });
    }
  }

  clearAllFilters(): void {
    this.searchControl.setValue('');
    this.selectedDepartment.setValue('');
    this.selectedJobRole.setValue('');
    this.selectedStatus.setValue('');
  }

  exportApplications(): void {
    // Implement CSV export functionality
    this.snackBar.open('Export functionality coming soon', 'Close', { duration: 3000 });
  }

  getStatusChipClass(status: Application['status']): string {
    const statusMap: { [key in Application['status']]: string } = {
      'new': 'status-chip-new',
      'screening': 'status-chip-screening',
      'interview_scheduled': 'status-chip-interview',
      'interviewed': 'status-chip-interviewed',
      'hired': 'status-chip-hired',
      'rejected': 'status-chip-rejected',
      'withdrawn': 'status-chip-withdrawn'
    };
    return statusMap[status] || 'status-chip-default';
  }

  getCandidateName(application: Application): string {
    return `${application.first_name} ${application.last_name}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getExperienceText(years: number): string {
    if (years === 0) return 'Fresher';
    if (years === 1) return '1 year';
    return `${years} years`;
  }
}
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';
import { DepartmentFormComponent } from '../department-form/department-form.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'department_info', 
    'manager_info', 
    'metrics', 
    'status', 
    'management_actions'
  ];
  
  dataSource = new MatTableDataSource<Department>([]);
  loading = false;
  searchTerm = '';
  selectedDepartment: Department | null = null;

  constructor(
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getDepartments().subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data.departments;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading departments:', error);
        this.snackBar.open('Error loading departments', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDepartmentForm(department?: Department): void {
    const dialogRef = this.dialog.open(DepartmentFormComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: department ? { department, mode: 'edit' } : { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartments();
      }
    });
  }

  deleteDepartment(department: Department): void {
    if (confirm(`Are you sure you want to delete the ${department.name} department?`)) {
      this.departmentService.deleteDepartment(department.id!).subscribe({
        next: () => {
          this.snackBar.open('Department deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadDepartments();
        },
        error: (error: any) => {
          console.error('Error deleting department:', error);
          const errorMessage = error.error?.message || 'Error deleting department';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  viewDepartment(department: Department): void {
    // TODO: Navigate to department detail view
    console.log('View department:', department);
    this.snackBar.open('Department details view coming soon', 'Close', {
      duration: 3000
    });
  }

  // Enhanced methods for the new UI
  selectDepartment(department: Department): void {
    this.selectedDepartment = this.selectedDepartment?.id === department.id ? null : department;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.dataSource.filter = '';
  }

  exportDepartments(): void {
    // TODO: Implement export functionality
    this.snackBar.open('Export functionality coming soon', 'Close', {
      duration: 3000
    });
  }

  manageDepartmentStaff(department: Department): void {
    // TODO: Navigate to department staff management
    this.snackBar.open('Department staff management coming soon', 'Close', {
      duration: 3000
    });
  }

  manageDepartmentBudget(department: Department): void {
    // TODO: Navigate to department budget management
    this.snackBar.open('Department budget management coming soon', 'Close', {
      duration: 3000
    });
  }

  truncateText(text: string | undefined, maxLength: number): string {
    if (!text) return 'No description available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  getDepartmentStatus(department: Department): string {
    if (!department.manager) return 'Needs Manager';
    if ((department.employee_count || 0) === 0) return 'No Staff';
    if ((department.employee_count || 0) < 5) return 'Small Team';
    return 'Active';
  }

  getDepartmentStatusShort(department: Department): string {
    if (!department.manager) return 'No Mgr';
    if ((department.employee_count || 0) === 0) return 'Empty';
    if ((department.employee_count || 0) < 5) return 'Small';
    return 'Active';
  }

  getDepartmentStatusClass(department: Department): string {
    if (!department.manager) return 'status-warning';
    if ((department.employee_count || 0) === 0) return 'status-error';
    if ((department.employee_count || 0) < 5) return 'status-info';
    return 'status-success';
  }

  getDepartmentStatusIcon(department: Department): string {
    if (!department.manager) return 'warning';
    if ((department.employee_count || 0) === 0) return 'error';
    if ((department.employee_count || 0) < 5) return 'info';
    return 'check_circle';
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = [
    'employee_id', 
    'employee_info', 
    'contact_info', 
    'role_department', 
    'status', 
    'actions'
  ];
  
  dataSource = new MatTableDataSource<Employee>([]);
  loading = false;
  searchTerm = '';
  selectedEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        this.dataSource.data = response.data.employees;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.snackBar.open('Error loading employees', 'Close', {
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

  openEmployeeForm(employee?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: employee ? { employee, mode: 'edit' } : { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      this.employeeService.deleteEmployee(employee.id!).subscribe({
        next: () => {
          this.snackBar.open('Employee deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.snackBar.open('Error deleting employee', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  viewEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.snackBar.open(`Viewing details for ${employee.first_name} ${employee.last_name}`, 'Close', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
    // TODO: Navigate to employee detail view or open detail dialog
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
  }

  sendEmail(employee: Employee): void {
    const email = employee.email;
    if (email) {
      window.open(`mailto:${email}`, '_blank');
      this.snackBar.open(`Opening email client for ${employee.first_name}`, 'Close', {
        duration: 2000,
        panelClass: ['info-snackbar']
      });
    } else {
      this.snackBar.open('No email address available for this employee', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  resetPassword(employee: Employee): void {
    const confirmReset = confirm(`Are you sure you want to reset the password for ${employee.first_name} ${employee.last_name}?`);
    if (confirmReset) {
      // TODO: Implement password reset functionality
      this.snackBar.open(`Password reset initiated for ${employee.first_name}`, 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      console.log('Password reset for employee:', employee);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.dataSource.filter = '';
  }

  refreshData(): void {
    this.loadEmployees();
    this.snackBar.open('Employee data refreshed', 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'check_circle';
      case 'inactive':
        return 'pause_circle';
      case 'terminated':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'primary';
      case 'inactive':
        return 'warn';
      case 'terminated':
        return 'accent';
      default:
        return '';
    }
  }
}
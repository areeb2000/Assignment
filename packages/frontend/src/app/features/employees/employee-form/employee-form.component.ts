import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import { Employee } from '../../../core/models/employee.model';
import { Department } from '../../../core/models/department.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  departments: Department[] = [];
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee?: Employee; mode: string }
  ) {
    this.isEditMode = data.mode === 'edit';
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDepartments();
    if (this.isEditMode && this.data.employee) {
      this.populateForm(this.data.employee);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      date_of_birth: ['', Validators.required],
      address: ['', Validators.required],
      role: ['', Validators.required],
      department_id: ['', Validators.required],
      salary: ['', [Validators.min(0)]],
      hire_date: ['', Validators.required],
      status: ['active', Validators.required],
      emergency_contact_name: [''],
      emergency_contact_phone: ['', Validators.pattern(/^\+?[\d\s-()]+$/)]
    });
  }

  populateForm(employee: Employee): void {
    this.employeeForm.patchValue({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      date_of_birth: employee.date_of_birth,
      address: employee.address,
      role: employee.role,
      department_id: employee.department_id,
      salary: employee.salary,
      hire_date: employee.hire_date,
      status: employee.status,
      emergency_contact_name: employee.emergency_contact_name,
      emergency_contact_phone: employee.emergency_contact_phone
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response: any) => {
        this.departments = response.data.departments;
      },
      error: (error: any) => {
        console.error('Error loading departments:', error);
        this.snackBar.open('Error loading departments', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      const formData = this.employeeForm.value;

      if (this.isEditMode && this.data.employee?.id) {
        this.employeeService.updateEmployee(this.data.employee.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Employee updated successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error updating employee:', error);
            this.snackBar.open('Error updating employee', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            this.loading = false;
          }
        });
      } else {
        this.employeeService.createEmployee(formData).subscribe({
          next: () => {
            this.snackBar.open('Employee created successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error creating employee:', error);
            this.snackBar.open('Error creating employee', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.employeeForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.replace('_', ' ')} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid format';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    }
    if (control?.hasError('min')) {
      return 'Value must be greater than 0';
    }
    return '';
  }
}
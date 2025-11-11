import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from '../../../core/services/department.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { Department } from '../../../core/models/department.model';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {
  departmentForm: FormGroup;
  employees: Employee[] = [];
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DepartmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { department?: Department; mode: string }
  ) {
    this.isEditMode = data.mode === 'edit';
    this.departmentForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEmployees();
    if (this.isEditMode && this.data.department) {
      this.populateForm(this.data.department);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      manager_id: [''],
      budget: ['', [Validators.min(0)]]
    });
  }

  populateForm(department: Department): void {
    this.departmentForm.patchValue({
      name: department.name,
      description: department.description,
      manager_id: department.manager_id,
      budget: department.budget
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: any) => {
        this.employees = response.data.employees;
      },
      error: (error: any) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      this.loading = true;
      const formData = this.departmentForm.value;

      if (this.isEditMode && this.data.department?.id) {
        this.departmentService.updateDepartment(this.data.department.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Department updated successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error updating department:', error);
            this.snackBar.open('Error updating department', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
            this.loading = false;
          }
        });
      } else {
        this.departmentService.createDepartment(formData).subscribe({
          next: () => {
            this.snackBar.open('Department created successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error creating department:', error);
            this.snackBar.open('Error creating department', 'Close', {
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
    Object.keys(this.departmentForm.controls).forEach(key => {
      const control = this.departmentForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.departmentForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.replace('_', ' ')} is required`;
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    }
    if (control?.hasError('min')) {
      return 'Budget must be greater than 0';
    }
    return '';
  }
}
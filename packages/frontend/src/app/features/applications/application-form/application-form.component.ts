import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApplicationService, Application, JobRole } from '../../../core/services/application.service';

export interface ApplicationFormData {
  application?: Application;
  jobRoles: JobRole[];
}

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {
  applicationForm!: FormGroup;
  loading = false;
  isEditMode = false;
  jobRoles: JobRole[] = [];

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private dialogRef: MatDialogRef<ApplicationFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationFormData
  ) {
    this.jobRoles = data.jobRoles || [];
    this.isEditMode = !!data.application;
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.application) {
      this.populateForm(this.data.application);
    }
  }

  private initializeForm(): void {
    this.applicationForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,}$/)]],
      job_role_id: ['', Validators.required],
      experience_years: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      resume_url: [''],
      cover_letter: [''],
      status: ['new'],
      applied_date: [new Date().toISOString().split('T')[0], Validators.required],
      interview_date: [''],
      notes: ['']
    });
  }

  private populateForm(application: Application): void {
    this.applicationForm.patchValue({
      first_name: application.first_name,
      last_name: application.last_name,
      email: application.email,
      phone: application.phone,
      job_role_id: application.job_role_id,
      experience_years: application.experience_years,
      resume_url: application.resume_url || '',
      cover_letter: application.cover_letter || '',
      status: application.status,
      applied_date: application.applied_date,
      interview_date: application.interview_date || '',
      notes: application.notes || ''
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.applicationForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.replace('_', ' ')} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    if (field?.hasError('minlength')) {
      return `Minimum ${field.errors?.['minlength'].requiredLength} characters required`;
    }
    if (field?.hasError('min')) {
      return `Minimum value is ${field.errors?.['min'].min}`;
    }
    if (field?.hasError('max')) {
      return `Maximum value is ${field.errors?.['max'].max}`;
    }
    return '';
  }

  getJobRolesByDepartment(): { [department: string]: JobRole[] } {
    return this.jobRoles.reduce((acc, jobRole) => {
      const department = jobRole.department_name || 'Unknown';
      if (!acc[department]) {
        acc[department] = [];
      }
      acc[department].push(jobRole);
      return acc;
    }, {} as { [department: string]: JobRole[] });
  }

  getStatusOptions() {
    return this.applicationService.getStatusOptions();
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formData = this.applicationForm.value;

    const operation = this.isEditMode
      ? this.applicationService.updateApplication(this.data.application!.id!, formData)
      : this.applicationService.createApplication(formData);

    operation.subscribe({
      next: (application) => {
        const message = this.isEditMode
          ? 'Application updated successfully'
          : 'Application created successfully';
        
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.dialogRef.close(application);
      },
      error: (error) => {
        console.error('Error saving application:', error);
        const message = this.isEditMode
          ? 'Error updating application'
          : 'Error creating application';
        
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.applicationForm.controls).forEach(key => {
      const control = this.applicationForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to get selected job role details
  getSelectedJobRole(): JobRole | undefined {
    const jobRoleId = this.applicationForm.get('job_role_id')?.value;
    return this.jobRoles.find(jr => jr.id === jobRoleId);
  }

  // Method to handle file upload for resume
  onResumeUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // For now, we'll just store the file name
      this.applicationForm.patchValue({
        resume_url: file.name
      });
      this.snackBar.open('Resume file selected (upload functionality pending)', 'Close', { duration: 3000 });
    }
  }

  // Method to clear resume
  clearResume(): void {
    this.applicationForm.patchValue({
      resume_url: ''
    });
  }
}
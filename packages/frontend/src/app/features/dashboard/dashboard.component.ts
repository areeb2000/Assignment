import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  // Mock data for now
  dashboardStats = {
    totalEmployees: 25,
    totalApplicants: 48,
    departmentCount: 5,
    activeJobRoles: 8
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  // Role display methods for enhanced UI
  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'super_admin':
        return 'Super Administrator';
      case 'admin':
        return 'System Administrator';
      case 'hr_user':
        return 'Human Resources User';
      default:
        return 'User';
    }
  }

  getRoleShortName(role: string): string {
    switch (role) {
      case 'super_admin':
        return 'S-Admin';
      case 'admin':
        return 'Admin';
      case 'hr_user':
        return 'HR';
      default:
        return 'User';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'super_admin':
        return 'admin_panel_settings';
      case 'admin':
        return 'manage_accounts';
      case 'hr_user':
        return 'people';
      default:
        return 'person';
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'super_admin':
        return 'super-admin-badge';
      case 'admin':
        return 'admin-badge';
      case 'hr_user':
        return 'hr-badge';
      default:
        return 'user-badge';
    }
  }

  // Navigation methods for metric cards
  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  navigateToApplications(): void {
    this.router.navigate(['/applications']);
  }

  navigateToDepartments(): void {
    this.router.navigate(['/departments']);
  }

  navigateToJobRoles(): void {
    this.router.navigate(['/applications']); // Job roles are managed in applications module
  }
}
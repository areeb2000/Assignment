import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  // Default redirect to dashboard if authenticated, otherwise to login
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Authentication routes (lazy loaded)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  
  // Dashboard route (protected)
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  
  // Employee management routes (protected)
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule),
    canActivate: [AuthGuard]
  },
  
  // Job applications routes (protected)
  {
    path: 'applications',
    loadChildren: () => import('./features/applications/applications.module').then(m => m.ApplicationsModule),
    canActivate: [AuthGuard]
  },
  
  // Department management routes (protected)
  {
    path: 'departments',
    loadChildren: () => import('./features/departments/departments.module').then(m => m.DepartmentsModule),
    canActivate: [AuthGuard]
  },
  
  // Document management routes (protected)
  {
    path: 'documents',
    loadChildren: () => import('./features/documents/documents.module').then(m => m.DocumentsModule),
    canActivate: [AuthGuard]
  },
  
  // Admin routes (Super Admin only)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['super_admin'] }
  },
  
  // Wildcard route - redirect to dashboard
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

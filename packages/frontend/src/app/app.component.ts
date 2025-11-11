import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from './core/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Employee & Recruitment Management System';
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  
  // Form properties
  loginForm: FormGroup;
  registerForm: FormGroup;
  showRegister = false;
  hidePassword = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    
    // Initialize forms
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['hr_user', Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialize authentication state
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login({ email, password }).toPromise();
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        this.snackBar.open(error.message || 'Login failed', 'Close', { duration: 5000 });
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.registerForm.value;
        await this.authService.register(formData).toPromise();
        this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
        this.showRegister = false;
        this.registerForm.reset();
      } catch (error: any) {
        this.snackBar.open(error.message || 'Registration failed', 'Close', { duration: 5000 });
      } finally {
        this.isLoading = false;
      }
    }
  }

  toggleAuthMode(): void {
    this.showRegister = !this.showRegister;
    this.loginForm.reset();
    this.registerForm.reset();
  }

  async quickLogin(type: 'admin' | 'hr'): Promise<void> {
    this.isLoading = true;
    try {
      const credentials = {
        admin: { email: 'admin@company.com', password: 'admin123' },
        hr: { email: 'hr@company.com', password: 'hr123' }
      };
      
      const { email, password } = credentials[type];
      await this.authService.login({ email, password }).toPromise();
      this.snackBar.open(`Quick login as ${type.toUpperCase()} successful!`, 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.snackBar.open(error.message || 'Quick login failed', 'Close', { duration: 5000 });
    } finally {
      this.isLoading = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

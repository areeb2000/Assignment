import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles: string[] = route.data['roles'] || [];
    
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/auth/login']);
        }

        if (requiredRoles.length === 0 || requiredRoles.includes(user.role)) {
          return true;
        } else {
          return this.router.createUrlTree(['/dashboard']);
        }
      })
    );
  }
}
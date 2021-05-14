import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../localStorage.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private user: LocalStorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean | UrlTree> | boolean {
    const routePermissions = route.data['permissions'] as Array<string>;
    const userPermissions = this.user.get('permissions');

    if (userPermissions && this.user.get('token')) {
      return this.checkPermissions(
        userPermissions.split(','),
        routePermissions
      );
    } else {
        this.router.navigate(['/']);
        return false;
    }
  }

  checkPermissions(user, route) {
    for (let r of route) {
      if (user.includes(r) === false) {
        this.router.navigate(['/']);
        return false;
      }
    }
    return true;
  }
}

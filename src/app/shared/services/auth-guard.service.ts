import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(public authService: AuthService, public router: Router) {}

    /**
     * Check authentication and permission of current user before navigate other page
     *
     * @returns boolean
     */
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let isAuthenticated = await this.authService.isAuthenticated();
        if (!isAuthenticated) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        return true;
    }
}

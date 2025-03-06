import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RoleGuard {
    constructor(
        private authService: AuthService,
        private router:Router
    ) { }
    
    private checkUserRole(): boolean | Observable<boolean>{
        
        const user = this.authService.currentUser;

        if (user?.role == 'admin') {
            return true;
        }

        this.router.navigate(['./'])
        return false;
    }

    canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        return this.checkUserRole();    
    }
        
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        return this.checkUserRole();    
    }
    
}
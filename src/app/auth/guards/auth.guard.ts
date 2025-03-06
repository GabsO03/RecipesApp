import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private router:Router
    ) { }
    
    
    private checkAuthStatus(): boolean | Observable<boolean>{
        return this.authService.checkAuthenticacion()
        .pipe(
          // tap( isAuthenticated => console.log('Autenticado: ', isAuthenticated)),
          tap( isAuthenticated => {
            if ( ! isAuthenticated ){
              this.router.navigate(['./auth/login'])
            }})
        )  
    }

    
    canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        // console.log('Can Match');
        // console.log({ route, segments});
    
        return this.checkAuthStatus(); 
      }
     
      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        // console.log('Can Activate');
        // console.log({ route, state});
    
        return this.checkAuthStatus();
      }
    
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

    private baseUrl: string = environment.baseURL;
    private user?: User;

    constructor(private httpClient: HttpClient) { }
    
    addUser( user: User ): Observable<User> {
        return this.httpClient.post<any>(`${this.baseUrl}/api/v1/users`, user)
        .pipe(
            map(resultado => resultado.data)
        );
    }

    get currentUser():User|undefined {
        if ( !this.user ) return undefined;
        return structuredClone( this.user );
    }
    
    checkAuthenticacion(): Observable<boolean>{
   
        if (!localStorage.getItem('token')) return of(false);
       
        const token = localStorage.getItem('token');
    
        return this.httpClient.get<any>(`${ this.baseUrl }/api/v1/users/${token}`)
        .pipe (
            tap ( user => this.user = user.data),
            map ( user => !!user.data),
            catchError ( err => of(false))
        )
    }
    

    login (username: string, email: string):Observable<User | false> {
        return this.httpClient.get<any>(`${ this.baseUrl }/api/v1/users?username=${ username }&email=${ email }`)
        .pipe(
            catchError((err) => of(false)),
            map( (respuesta) => {
                if (respuesta) {
                    const user = respuesta.data;
                    this.user = user
                    localStorage.setItem('token', user.id.toString())
                    return user;
                }
            })
        )
    }
    
    logout () {
        this.user = undefined;
        localStorage.clear();
    }
}
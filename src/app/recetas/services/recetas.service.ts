import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Recipe } from '../interfaces/receta.interface';

@Injectable({providedIn: 'root'})
export class RecetasService {

  private baseURL: string = environment.baseURL

  constructor(private httpClient: HttpClient) { }

  getIngredients(param: string): Observable<{ id: number; name: string }[]>{
    return this.httpClient.get<any>(`${ this.baseURL }/api/v1/ingredients?q=${param}`)
    .pipe(
      map(ingredientes => ingredientes.data)
    )
  }

  addIngredient( ingrediente: string ): Observable<string | false> {
    return this.httpClient.post<string>(`${this.baseURL}/api/v1/ingredients`, { name: ingrediente })
    .pipe(
      catchError(error => of('No se pudo'))
    )   
  }

  getRecetas(): Observable<Recipe[]>{
    return this.httpClient.get<any>(`${ this.baseURL }/api/v1/recipes`)
    .pipe(
      map(recetario => recetario.data)
    );
  }

  getRecetaById(id: number): Observable<Recipe>{
    return this.httpClient.get<any>(`${ this.baseURL }/api/v1/recipes/${ id }`)
    .pipe(
      delay(800),
      catchError(error => of(undefined)),
      map(recetario => recetario.data) 
    );
  }

  getSuggestions( entrada: string): Observable<Recipe[]>{
    return this.httpClient.get<any>(`${ this.baseURL }/api/v1/recipes?q=${entrada}&limit=6`)
    .pipe(
      map(recetario => recetario.data)
    );
  }

  addReceta( receta: Recipe ): Observable<Recipe> {
    return this.httpClient.post<any>(`${this.baseURL}/api/v1/recipes`, receta)
    .pipe(
      map(resultado => resultado.data)
    );
  }

  updateReceta( receta: Recipe ): Observable<Recipe>{
    if ( !receta.id ) throw Error ('Receta id is required');

    return this.httpClient.patch<any>(`${this.baseURL}/api/v1/recipes/${ receta.id }`, receta)
    .pipe(
      map(resultado => resultado.data)
    );
  }

  deleteRecetaById( id: string ): Observable<boolean> {
    return this.httpClient.delete(`${this.baseURL}/api/v1/recipes/${ id }`)
      .pipe(
        map( resp => true),
        catchError ( err => of(false))
      );
  }


}
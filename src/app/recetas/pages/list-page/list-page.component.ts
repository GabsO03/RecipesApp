import { Component } from '@angular/core';
import { Recipe } from '../../interfaces/receta.interface';
import { RecetasService } from '../../services/recetas.service';
import { tap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent {
  public recetas: Recipe[] = [];
  public esAdmin!: boolean;
  constructor(
    private recetasService: RecetasService,
    private authService: AuthService
  ){
    const userRole = this.authService.currentUser?.role; 
    this.esAdmin = userRole == 'admin';
   }
 
  ngOnInit(): void {
    this.recetasService.getRecetas()
    .subscribe ( recetas => this.recetas = recetas)
  }
  

}

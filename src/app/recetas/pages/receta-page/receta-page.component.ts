import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/receta.interface';
import { RecetasService } from '../../services/recetas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-receta-page',
  templateUrl: './receta-page.component.html',
  styles: ``
})
export class RecetaPageComponent implements OnInit {
  public receta?: Recipe;
  public esAdmin!: boolean;

  constructor(
    private recetasService: RecetasService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
    const userRole = this.authService.currentUser?.role; 
    this.esAdmin = userRole == 'admin';
  }

  //TODO ponerle checks a estos

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.recetasService.getRecetaById(id))
    )
    .subscribe( receta => {
      if (!receta) return this.router.navigate(['/recetas/list']);

      this.receta = receta;
      return;
    })
  }

  goList():void {
    this.router.navigateByUrl('/recetas/list');
  }

  onDeleteReceta(){
    if ( !this.receta ) throw Error('Receta id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {name: this.receta.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) return;

      this.recetasService.deleteRecetaById( this.receta!.id )
      .pipe(
        filter ((result:boolean) => result),
        filter ( (wasDeleted:boolean)=>wasDeleted),
        tap ( wasDeleted => console.log({wasDeleted})
        )
      )  
      .subscribe ( wasDeleted =>{
        if ( wasDeleted )
          this.router.navigate(['/recetas'])
          this.showSnackbar(`${ this.receta!.name } succesfully deleted!`)
      })
    });
  }

  showSnackbar ( message: string):void {
    this.snackbar.open ( message, 'done',{
      duration: 2500,
    })
  }
}
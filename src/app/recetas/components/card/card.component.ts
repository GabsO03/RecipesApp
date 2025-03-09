import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/receta.interface';
import { RecetasService } from '../../services/recetas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'recetas-receta-card',
  templateUrl: './card.component.html',
  styles: ``
})
export class CardComponent implements OnInit{

  @Input()
  public receta!: Recipe;
  @Input()
  public index!: number;

  @Input()
  public esAdmin!: boolean;
  

  constructor(
    private recetasService: RecetasService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if ( !this.receta ) throw Error ('Receta property is required');
  }

  toggleMenu(id: string) {
    const menu = document.getElementById(id) as HTMLDivElement;

    if (menu.classList.contains('hidden')) {
      menu.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
    }
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
        if ( wasDeleted ) {
          // this.router.navigate(['/recetas'])
          location.reload();
          this.showSnackbar(`${ this.receta.name } succesfully deleted!`)
        }

      })
    });
  }

  showSnackbar ( message: string):void {
    this.snackbar.open ( message, 'done',{
      duration: 2500,
    })
  }
}

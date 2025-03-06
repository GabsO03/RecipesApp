import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecetasService } from '../../services/recetas.service';
import { Receta } from '../../interfaces/receta.interface';
import { debounceTime, delay, filter, switchMap, tap } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../auth/services/auth.service';
import { CapitalizeWordPipe } from '../../pipes/category-capital.pipe';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public recipeForm: FormGroup;
  public newIngredient: FormControl = new FormControl('');
  public newCategoria: FormControl = new FormControl('');
  public existingIngredients?:string[];

  constructor(
    private fb: FormBuilder,
    private recetasService: RecetasService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.recipeForm = this.fb.group({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('',Validators.required),
      ingredients: this.fb.array([], Validators.required),
      time: new FormControl(0, [Validators.required, Validators.min(1)]),
      categories: this.fb.array([], Validators.required),
      instructions: new FormControl('', Validators.required),
      alt_img: ['']
    });
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(
        switchMap ( ({id}) => this.recetasService.getRecetaById( id ))
      ).subscribe ( receta => {
        if ( !receta ) return this.router.navigateByUrl('/');

        receta.ingredients.forEach((ing: string) => {
          this.onAddToIngredients(ing);
        });

        receta.categories.forEach((cat: string) => {
          this.onAddToCategorias(cat);
        });

        this.recipeForm.reset({ ...receta, time: receta.time.replace(' minutos', '').trim() }); //Esto es porque el tiempo lo quiero en número
        return;
      })
  }

  get currentReceta(): Receta{
    let instructiones: string[] = [];
    if (this.recipeForm.value.instructions) { //Esto por sí es edición
      if (Array.isArray(this.recipeForm.value.instructions)) instructiones = this.recipeForm.value.instructions
      else instructiones = this.recipeForm.value.instructions.split('.')
    }

    const receta: Receta = {
      id: this.recipeForm.value.id ?? '',
      name: this.recipeForm.value.name ?? '',
      description: this.recipeForm.value.description ?? '',
      ingredients: this.recipeForm.value.ingredients ?? [],
      time: (this.recipeForm.value.time ? this.recipeForm.value.time : 0) + ' minutos',
      categories: this.recipeForm.value.categories ?? [],
      instructions: instructiones,
      alt_img: this.recipeForm.value.alt_img ?? '',
      createdAt: this.recipeForm.value.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return receta;
  }

  onSubmit(): void{
    if ( this.recipeForm.invalid ){
      this.recipeForm.markAllAsTouched();
      return;
    }

    if ( this.currentReceta.id ){
      this.recetasService.updateReceta( this.currentReceta )
        .subscribe ( receta =>{
          this.showSnackbar(`${ receta.name } updated!`)
        } );
      return;
    };

    this.recetasService.addReceta( this.currentReceta )
    .subscribe( receta => {
      this.router.navigate(['/recetas/edit', receta.id]);
      this.showSnackbar(`${ receta.name } created!`)
    });

    (this.recipeForm.controls['ingredients'] as FormArray) = this.fb.array([]);
    this.recipeForm.reset();
  }

  onDeleteReceta(){
    if ( !this.currentReceta.id ) throw Error('Receta id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {name: this.currentReceta.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) return;

      this.recetasService.deleteRecetaById( this.currentReceta.id )
      .pipe(
        filter ((result:boolean) => result),
        switchMap( ()=> this.recetasService.deleteRecetaById( this.currentReceta.id) ),
        filter ( (wasDeleted:boolean)=>wasDeleted),
        tap ( wasDeleted => console.log({wasDeleted})
        )
      )  
      .subscribe ( wasDeleted =>{
        if ( wasDeleted ) {
          this.router.navigate(['/recetas'])
          this.showSnackbar(`${ this.currentReceta.name } succesfully deleted!`)
        }
      })
    });
  }

  showSnackbar ( message: string):void {
    this.snackbar.open ( message, 'done',{
      duration: 2500,
    })
  }







  
  // PARA LOS INGREDIENTES
  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  consigueIngredientes() {
    this.newIngredient?.valueChanges
    .pipe(
      debounceTime(500)
    )
    .subscribe(value => {
      if (!value) {
        this.existingIngredients = [] //Esto por si borra el input
        return;
      }
      this.recetasService.getIngredients(value)
      .subscribe(ingredientes => {
          this.existingIngredients = ingredientes || [];

          //Esto para que no se vea doble
          const yaExiste = this.existingIngredients.some(ingr => 
            ingr.toLowerCase().localeCompare(this.newIngredient.value.toLowerCase(), 'es', { sensitivity: 'base' }) === 0
          );

          if (!yaExiste) {
            this.existingIngredients.unshift(this.newIngredient.value);
          }
      })
    })
  }

  onDeleteIngredient( index:number ):void {
    this.ingredients.removeAt(index);
  }

  //Para añadir un ingrediente
  onAddToIngredients(valor?: string):void {
    //Esto cuando se introduce manualmente para la edición
    if(valor) {
      this.ingredients.push(
        this.fb.control(valor)
      );
      return;
    }
    else {
      let agregado = false;
      if ( this.newIngredient.invalid ) return;

      if ((!this.existingIngredients || this.existingIngredients!.length === 0) && this.newIngredient.value) {
        this.recetasService.addIngredient(this.newIngredient.value).subscribe(respuesta => {
          respuesta? agregado = true : false;
        });
      }

      const newIngredient = this.newIngredient.value;

      if (agregado) {
        this.ingredients.push(
          this.fb.control( newIngredient )
        );
      }

      this.newIngredient.setValue(null);
      this.existingIngredients = [];
    }
  }

  isValidField( field: string): boolean| null{
    return this.recipeForm.controls[field].errors
      && this.recipeForm.controls[field].touched;
  }

  getFieldError( field: string): string | null {
    if (!this.recipeForm.controls[field] ) return null;

    const errors = this.recipeForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch ( key ){
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `La cantidad debe de ser ${errors['min'].min} o mayor`
      }
    }
    return null;
  }









  //PARA LAS CATEGORIAS
  get categories(): FormArray {
    return this.recipeForm.get('categories') as FormArray;
  }

  onAddToCategorias(valor?: string):void {
    //Esto cuando se introduce manualmente para la edición
    if(valor) {
      this.categories.push(
        this.fb.control(valor)
      );
      return;
    }
    else {
      if ( this.newCategoria.invalid ) return;

      const newCategoria = this.newCategoria.value;

      const existe = this.categories.value.some((cat: string) => 
        cat.toLowerCase() === newCategoria.toLowerCase()
      );

      if (!existe) {
        this.categories.push(
          this.fb.control( newCategoria )
        );
      }

      this.newCategoria.setValue(null);
    }
  }

  onDeleteCategoria( index:number ):void {
    this.categories.removeAt(index);
  }

}

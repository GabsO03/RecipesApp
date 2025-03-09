import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecetasService } from '../../services/recetas.service';
import { Ingredient, Recipe } from '../../interfaces/receta.interface';
import { debounceTime, filter, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public recipeForm: FormGroup;
  public newEtiqueta: FormControl = new FormControl('');
  public newInstruccion: FormControl = new FormControl('');

  public newIngredient: FormControl = new FormControl('');
  public ingredientAmount: FormControl = new FormControl('', Validators.min(0));
  public ingredientUnit: FormControl = new FormControl('');

  public existingIngredients?: { id: number; name: string }[] = [];
  public yaExiste = false;

  unidadesMedida: string[] = ['kg', 'gr', 'ltr', 'ml', 'oz', 'tbspn', 'tspn'];

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
      tags: this.fb.array([], Validators.required),
      instructions: this.fb.array([], Validators.required),
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

        receta.ingredients.forEach((ing: Ingredient) => {
          this.onAddToIngredients(ing);
        });

        receta.tags.forEach((tag: string) => {
          this.onAddToTags(tag);
        });

        receta.instructions.forEach((step: string) => {
          this.onAddToSteps(step);
        });

        this.recipeForm.reset({ ...receta, time: receta.time.replace(' minutos', '').trim() }); //Esto es porque el tiempo lo quiero en número
        return;
      })
  }

  get currentReceta(): Recipe{
    const receta: Recipe = {
      id: this.recipeForm.value.id ?? '',
      name: this.recipeForm.value.name ?? '',
      description: this.recipeForm.value.description ?? '',
      ingredients: this.recipeForm.value.ingredients ?? [],
      time: (this.recipeForm.value.time ? this.recipeForm.value.time : 0) + ' minutos',
      tags: this.recipeForm.value.tags ?? [],
      instructions: this.recipeForm.value.instructions ?? [],
      alt_img: this.recipeForm.value.alt_img ?? '',
      created_at: this.recipeForm.value.created_at ?? new Date(),
      updated_at: new Date()
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
          this.yaExiste = this.existingIngredients.some(ingr => 
            ingr.name.toLowerCase().localeCompare(this.newIngredient.value.toLowerCase(), 'es', { sensitivity: 'base' }) === 0
          );
      })
    })
  }

  onDeleteIngredient( index:number ):void {
    this.ingredients.removeAt(index);
  }

  //Para añadir un ingrediente
  onAddToIngredients(valor?: Ingredient):void {
    //Esto cuando se introduce manualmente para la edición
    if(valor) {
      this.ingredients.push(
        this.fb.control(valor)
      );
      return;
    }
    else {
      if ( this.newIngredient.invalid || this.ingredientAmount.invalid || this.ingredientUnit.invalid ) return;

      const newIngredient = this.newIngredient.value.trim();

      if (newIngredient) {//Para que no haga nada si está vacío
        const estaEnArray = this.ingredients.value.some((ing: Ingredient) => ing.nameIngredient === newIngredient.toLowerCase()
        ); //Esto para que no se ejecute nada si ya está en el array y no se ingrese doble
        let existeEnBd = false; 
  
        if (!estaEnArray) {

          if (this.existingIngredients && this.existingIngredients.length > 0) {
            existeEnBd = this.existingIngredients.some((ing) => ing.name.toLowerCase() === newIngredient.toLowerCase());
          }; //Por si directamente no existe en la bbdd

          const ingrediente: Ingredient = {
            amount: this.ingredientAmount.value,
            unitMeasure: this.ingredientUnit.value,
            nameIngredient: newIngredient
          }

          if (existeEnBd) { //Si no está lo agrega
            this.ingredients.push(
              this.fb.control( ingrediente )
            );
          }
          else {
            this.recetasService.addIngredient(newIngredient).subscribe(respuesta => {
              if (respuesta) {
                this.ingredients.push(
                  this.fb.control( ingrediente )
                );
              }
            });
          }
        }

        this.newIngredient.reset();
        this.ingredientAmount.reset();
        this.ingredientUnit.reset();
        
        this.existingIngredients = [];

      }

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
  get tags(): FormArray {
    return this.recipeForm.get('tags') as FormArray;
  }

  onAddToTags(valor?: string):void {
    //Esto cuando se introduce manualmente para la edición
    if(valor) {
      this.tags.push(
        this.fb.control(valor)
      );
      return;
    }
    else {
      if ( this.newEtiqueta.invalid ) return;

      const newEtiqueta = this.newEtiqueta.value;

      const existe = this.tags.value.some((cat: string) => 
        cat.toLowerCase() === newEtiqueta.toLowerCase()
      );

      if (!existe) {
        this.tags.push(
          this.fb.control( newEtiqueta )
        );
      }

      this.newEtiqueta.setValue(null);
    }
  }

  onDeleteCategoria( index:number ):void {
    this.tags.removeAt(index);
  }


  //PARA LAS INSTRUCCIONES
  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  onAddToSteps(valor?: string):void {
    //Esto cuando se introduce manualmente para la edición
    if(valor) {
      this.instructions.push(
        this.fb.control(valor)
      );
      return;
    }
    else {
      if ( this.newInstruccion.invalid ) return;

      const newInstruccion = this.newInstruccion.value;
 
      this.instructions.push(
        this.fb.control( newInstruccion )
      );

      this.newInstruccion.setValue(null);
    }
  }

  onDeleteStep( index:number ):void {
    this.instructions.removeAt(index);
  }
}

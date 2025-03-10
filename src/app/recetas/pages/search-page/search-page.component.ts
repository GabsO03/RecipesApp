import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RecetasService } from '../../services/recetas.service';
import { Recipe } from '../../interfaces/receta.interface';
import { debounceTime, delay, of, tap } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent {

  public searchInput = new FormControl('');
  public recetas?:Recipe[];
  public selectedRecipe?:Recipe;

  constructor(
    private recetasService:RecetasService
  ) {}

  searchReceta() {
    this.searchInput?.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value =>{
      if ( value ) {
        this.recetasService.getSuggestions( value.toLowerCase() )
        .subscribe( recetas => this.recetas = recetas )
      }
    })
  }

  onSelectedRecipe(event: MatAutocompleteSelectedEvent) {
    if (!event.option.value) {
      this.selectedRecipe = undefined;
      return;
    }

    const receta: Recipe = event.option.value;
    this.searchInput.setValue( receta.name );
    this.selectedRecipe = receta;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Ingredient } from '../interfaces/receta.interface';

@Pipe({
  name: 'ingredientPipe'
})
export class IngredientPipe implements PipeTransform {

  transform(ingredient: Ingredient): string {
    return `${ingredient.amount} ${ingredient.unitMeasure} de ${ingredient.nameIngredient}`;
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { Receta } from '../interfaces/receta.interface';

@Pipe({
  name: 'recipeImage'
})
export class RecipeImagePipe implements PipeTransform {

  transform(receta: Receta): unknown {
    if (!receta.id || !receta.alt_img) {
      return 'no_image.jpg';
    }

    if ( receta.alt_img ) return receta.alt_img;

    return `recetas/${ receta.id }.jpg`
  }

}

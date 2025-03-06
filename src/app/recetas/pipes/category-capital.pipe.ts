import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeWord'
})
export class CapitalizeWordPipe implements PipeTransform {

  transform(word: string): unknown {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  }

}

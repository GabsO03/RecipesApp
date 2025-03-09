import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descripcionPipe'
})
export class DescripcionPipe implements PipeTransform {

  transform(value: string): unknown {
    return value.length >= 50 ? value.substring(0, 50) + " . . . " : value;
  }

}

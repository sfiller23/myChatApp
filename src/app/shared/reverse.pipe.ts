import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
  pure: false
})
export class ReversePipe implements PipeTransform {

  transform(value: any) {
    let arrayCopy = [...value];
    return arrayCopy.reverse();
  }
}

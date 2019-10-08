import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'haskeys'
})
export class HaskeysPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return Object.keys(value).length;
  }

}

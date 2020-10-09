import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  filteredList: any;
  transform(tablerowData: any[], value: any, val: any): any[] {
    if (!tablerowData || !value || !val) {
      return tablerowData;
    }
    return tablerowData.filter(item => item.price >= Number(value) && item.price <= Number(val));

  }


}

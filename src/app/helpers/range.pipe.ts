import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {

  transform(products: any, doubleSlider?: any): any {
        return doubleSlider
         ? products.filter(function(product) {return product.price <= doubleSlider[1] && product.price >= doubleSlider[0];})
         : products;
    }

}
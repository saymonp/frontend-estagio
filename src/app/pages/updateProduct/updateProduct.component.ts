import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-updateProduct',
    templateUrl: './updateProduct.component.html',
    styleUrls: ['./updateProduct.component.scss']
})

export class UpdateProductComponent implements OnInit {
  focus: any;
  focus1: any;
  doubleSlider = [20, 60];
  state_default: boolean = true;

  constructor() { }

  ngOnInit() {}

}

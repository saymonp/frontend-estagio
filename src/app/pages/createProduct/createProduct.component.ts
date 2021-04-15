import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-createProduct',
    templateUrl: './createProduct.component.html',
    styleUrls: ['./createProduct.component.scss']
})

export class CreateProductComponent implements OnInit {
  focus: any;
  focus1: any;
  doubleSlider = [20, 60];
  state_default: boolean = true;

  constructor() { }

  ngOnInit() {}

}

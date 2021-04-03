import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-productsList',
    templateUrl: './productsList.component.html',
    styleUrls: ['./productsList.component.scss']
})

export class ProductsListComponent implements OnInit {
  focus: any;
  focus1: any;
  simpleSlider = 40;
  doubleSlider = [20, 60];
  state_default: boolean = true;

  constructor() { }

  ngOnInit() {}

}

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ordersList',
    templateUrl: './ordersList.component.html',
    styleUrls: ['./ordersList.component.scss']
})

export class OrdersListComponent implements OnInit {
  focus: any;
  focus1: any;

  constructor() { }

  ngOnInit() {}

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}

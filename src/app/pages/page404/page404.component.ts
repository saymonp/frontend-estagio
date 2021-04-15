import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-page404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.scss']
})

export class Page404Component implements OnInit {
  focus: any;
  focus1: any;

  constructor() { }

  ngOnInit() {}

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}

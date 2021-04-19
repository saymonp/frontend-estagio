import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-usersList',
    templateUrl: './usersList.component.html',
    styleUrls: ['./usersList.component.scss']
})

export class UsersListComponent implements OnInit {
  focus: any;
  focus1: any;

  constructor() { }

  ngOnInit() {}

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}

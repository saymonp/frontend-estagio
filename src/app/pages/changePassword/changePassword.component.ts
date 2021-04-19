import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-changePassword',
    templateUrl: './changePassword.component.html',
    styleUrls: ['./changePassword.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  focus: any;
  focus1: any;

  constructor() { }

  ngOnInit() {}

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-usersList',
    templateUrl: './usersList.component.html',
    styleUrls: ['./usersList.component.scss']
})

export class UsersListComponent implements OnInit {
  focus: any;
  focus1: any;
  users$: Observable<any>;
  contentLoaded = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    setTimeout(() => {
      this.contentLoaded = true;
    }, 2000);
   // this.users$ = this.userService.listUsers();
  }

  //listUsers(){
  //  this.users$ = this.userService.listUsers();
  //}

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}

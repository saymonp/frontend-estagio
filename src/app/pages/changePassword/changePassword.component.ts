import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-changePassword',
    templateUrl: './changePassword.component.html',
    styleUrls: ['./changePassword.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  focus: any;
  focus1: any;
  passwordResetToken: string;
  newPassword: string;
  loading = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    const re = new RegExp("\/password\/reset\/(.+)");
    this.passwordResetToken = re.exec(this.router.url)[1];
  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  passwordReset() {
    if(!this.newPassword && !this.passwordResetToken){
      alert("Erro")
    } else {
    const newPassword = this.newPassword
    const passwordResetToken = this.passwordResetToken
    this.loading = true;
    this.userService.passwordReset({newPassword, passwordResetToken}).subscribe((res) => {
      console.log(res);
      this.loading = false;
    }, (err) => {
      this.loading = false;
      alert("Senha ou Email inválidos"); 
      })
  }
}

}

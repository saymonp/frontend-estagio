import { Component, Input, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  test: Date = new Date();
  focus;
  focus1;
  signupForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private userData: LocalStorageService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  @Input() password: string;
  @Input() email: string;
  @Input() name: string;

  ngOnInit() {
    if (this.tokenExpired(this.userData.get('token'))) {
      // token expired
      this.router.navigate(['/signin']);
    } else {
      this.signupForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],

        createproduct: [false],
        updateproduct: [false],
        deleteproduct: [false],

        createuser: [false],
        updateuser: [false],
        deleteuser: [false],
      });
    }
  }

  private tokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  registerUser() {
    if (!this.signupForm.valid) {
      return alert('Formulário Inválido');
    }
    this.loading = true;
    console.log(this.signupForm.value);

    let permissions = [
      this.signupForm.value.createproduct.checked
        ? 'create:product'
        : undefined,
      this.signupForm.value.updateproduct.checked
        ? 'update:product'
        : undefined,
      this.signupForm.value.deleteproduct.checked
        ? 'delete:product'
        : undefined,

      this.signupForm.value.createuser.checked ? 'create:user' : undefined,
      this.signupForm.value.updateuser.checked ? 'update:user' : undefined,
      this.signupForm.value.deleteuser.checked ? 'delete:user' : undefined,
    ];

    permissions = permissions.filter(function (p) {
      return p !== undefined;
    });

    console.log(permissions);

    const user = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      permissions,
    };

    this.userService.registerUser(user).subscribe(
      (res) => {
        console.log(res);
        localStorage.removeItem('httpuserlist');
        this.loading = false;
        if (res["error"] || res["statusCode"]) {
          alert("Ocorreu um erro: " + res["error"] + res["statusCode"]);
        }
      },
      (err) => {
        this.loading = false;
        alert('Ocorreu um erro');
      }
    );
  }
}

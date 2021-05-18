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
    // console.log(this.signupForm.value);

    let permissions = [
      this.signupForm.value.createproduct
        ? 'create:product'
        : undefined,
      this.signupForm.value.updateproduct
        ? 'update:product'
        : undefined,
      this.signupForm.value.deleteproduct
        ? 'delete:product'
        : undefined,

      this.signupForm.value.createuser ? 'create:user' : undefined,
      this.signupForm.value.updateuser ? 'update:user' : undefined,
      this.signupForm.value.deleteuser ? 'delete:user' : undefined,
    ];

    permissions = permissions.filter(function (p) {
      return p !== undefined;
    });

    // console.log(permissions);

    const user = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      permissions,
    };
    // console.log(user);
    this.userService.registerUser(user).subscribe(
      (res) => {
        // console.log(res);
        localStorage.removeItem('httpuserlist');
        this.loading = false;
        // console.log(res["body"]["error"]);
        if(res["body"]["error"] == "User already registered and not validated"){
          alert("Usuário já cadastrado e não validado")
        }
        if (res["errorMessage"] == "Unauthorized: Unauthorized: Unverified user"){
          alert("Operação não concluída, valide a conta pelo seu email");
        } else  {
        if (res["statusCode"] && res["statusCode"] != 200) {
          alert("Ocorreu um erro: " + res["error"] + res["statusCode"]);
        } else {
          alert("Usuário criado!")
        }
      }
      },
      (err) => {
        this.loading = false;
        alert('Ocorreu um erro');
      }
    );
  }
}

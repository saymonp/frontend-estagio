import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  test: Date = new Date();
  focus;
  focus1;
  loginForm: FormGroup;
  loading = false;
  recoverPassEmail: string;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  @Input() name: string;
  @Input() email: string;

  ngOnInit() {
    
    if (this.activatedRoute.snapshot.paramMap.get('token')) {
      const validationToken = this.activatedRoute.snapshot.paramMap.get('token');
      // console.log(validationToken);
      this.loading = true;
      this.userService
        .validation({ "confirmationToken": validationToken })
        .subscribe(
          (res) => {
            // console.log(res);
            alert("Usuário verificado")
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            alert('Ocorreu um erro na validação');
          }
        );
    }

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  closeResult = '';

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  login() {
    this.loading = true;
    this.userService.login(this.loginForm.value).subscribe(
      (user) => {
        if (user.user.verified == false) {
          alert("Valide a conta em seu email")
        }
        this.localStorageService.set('name', user.user.name);
        this.localStorageService.set('email', user.user.email);
        this.localStorageService.set(
          'permissions',
          user.user.permissions.toString()
        );
        this.localStorageService.set('token', user.user.token);
        window.location.href = window.location.protocol + '//' + window.location.host + '/';
        this.loading = false; 
      },
      (err) => {
        this.loading = false;
        alert('Senha ou Email inválidos');
      }
    );
  }

  recoverPass() {
    if (this.recoverPassEmail) {
      this.loading = false;
      // console.log(this.recoverPassEmail);
      this.userService
        .requestPasswordReset({ email: this.recoverPassEmail })
        .subscribe(
          (res) => {
            // console.log(res);
            alert('Um E-mail será enviado para a criação de uma nova senha.');
          },
          (err) => {
            this.loading = false;
            alert('Ocorreu um erro');
          }
        );
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

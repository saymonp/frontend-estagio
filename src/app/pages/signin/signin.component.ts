import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/localStorage.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
    test : Date = new Date();
    focus;
    focus1;
    loginForm: FormGroup;
    loading = false;

    constructor(private router: Router, private localStorageService: LocalStorageService,private formBuilder: FormBuilder, private modalService: NgbModal, private userService: UserService) {}
    
    @Input() name: string;
    @Input() email: string;

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required],
      });
    }

    closeResult = '';


  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
 
  login() {
    this.loading = true;
    this.userService.login(this.loginForm.value).subscribe((user) => {
      this.localStorageService.set("name", user.user.name);
      this.localStorageService.set("email", user.user.email);
      this.localStorageService.set("permissions", user.user.permissions.toString());
      this.localStorageService.set("token", user.user.token);
      this.loading = false;
      this.router.navigate(['/']);
    }, (err) => {
      this.loading = false;
      alert("Senha ou Email inválidos"); 
      }
      );
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

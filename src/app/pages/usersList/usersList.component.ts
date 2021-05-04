import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
  usersForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit() {
   this.users$ = this.userService.listUsers();
  }

  onSubmit(id) {
    const createproduct = document.getElementById(`createproduct${id}`) as HTMLInputElement;
    const updateproduct = document.getElementById(`updateproduct${id}`) as HTMLInputElement;
    const deleteproduct = document.getElementById(`deleteproduct${id}`) as HTMLInputElement;

    const createuser = document.getElementById(`createuser${id}`) as HTMLInputElement;
    const updateuser = document.getElementById(`updateuser${id}`) as HTMLInputElement;
    const deleteuser = document.getElementById(`deleteuser${id}`) as HTMLInputElement;
    
    let permissions = [
      createproduct.checked ? "create:product" : undefined,
      updateproduct.checked ? "update:product" : undefined,
      deleteproduct.checked ? "delete:product" : undefined,

      createuser.checked ? "create:user" : undefined,
      updateuser.checked ? "update:user" : undefined,
      deleteuser.checked ? "delete:user" : undefined,
    ]

    permissions = permissions.filter(function (p) { return p !== undefined });

    console.log(permissions)
 }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  updatePermissions(id) {
    if (confirm('Are you sure you want to save this thing into the database?')) {
      // Save it!
      console.log('Thing was saved to the database.'+id);
    } else {
      // Do nothing!
      console.log('Thing was not saved to the database.');
    }

  }

  deleteUser(name, id){
    if (confirm(`Você tem certeza que deseja excluir o usuário ${name}?`)) {
      // Save it!
      console.log('Deleta '+id);
    } else { 
      // Do nothing
    }
  }

}

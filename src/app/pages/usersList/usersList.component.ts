import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'app/services/localStorage.service';

import { UserService } from '../../services/user.service';

const USERSLISTKEY = "httpuserlist"

@Component({
    selector: 'app-usersList',
    templateUrl: './usersList.component.html',
    styleUrls: ['./usersList.component.scss']
})

export class UsersListComponent implements OnInit {
  focus: any;
  focus1: any;
  users: any;
  searchText: string;

  constructor(private userService: UserService, private userData: LocalStorageService, private router: Router) { 
  }

  ngOnInit() {
    if (this.tokenExpired(this.userData.get('token'))) {
      // token expired
      this.router.navigate(['/signin']);
    } else {
      this.getUsers()
    }
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  getUsers() {
    const chacheItem = this.getCacheItem();
    if (chacheItem) {
      console.log('Retrieved item from cache');
      this.users = chacheItem;
    }
    else {
    
    this.userService.listUsers().subscribe((data) => {
      this.users = data;
      this.setCacheItem(data);
    });
    
    console.log('Retrieved item from API');
  }
  }

  getCacheItem() {
    const cacheItem = JSON.parse(localStorage[USERSLISTKEY] || null)
    console.log(cacheItem);
    if (!cacheItem) {
        return null;
    }

    // delete the cache item if it has expired
    if (cacheItem.expires <= Date.now()) {
        console.log("item has expired");
        this.deleteCacheItem();
        return null;
    }

    return cacheItem.data;
  }

  setCacheItem(data): void {
    const EXPIRES = Date.now() + (1000 * 60 * 60) / 2; // 30 min
    console.log(EXPIRES)
    localStorage[USERSLISTKEY] = JSON.stringify({ expires: EXPIRES, data })
  }

  deleteCacheItem() {
      localStorage.removeItem(USERSLISTKEY)
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

    console.log(permissions);

    this.userService.updateUser({id, permissions}).subscribe((res) => {
      console.log(res);
      this.deleteCacheItem();
      const index = this.users.users.findIndex(u => u._id === id);
      console.log(this.users.users[index].permissions);
      this.users.users[index].permissions = permissions;
      console.log(this.users.users[index].permissions);
      this.setCacheItem(this.users);
    },(err) => {
      alert("Ocorreu um erro"); 
      })
 }

  deleteUser(name, email, id){
    if (confirm(`Você tem certeza que deseja excluir o usuário ${name}?`)) {
      this.userService.deleteUser({id, email}).subscribe((res) => {
        console.log(res);
        this.users.users = this.users.users.filter(user => user._id != id);

        this.deleteCacheItem()

        this.setCacheItem(this.users)
      })
    } else { 
      // Do nothing
    }
  }



}

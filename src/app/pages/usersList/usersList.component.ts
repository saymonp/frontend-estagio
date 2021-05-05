import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { TimestampObservableCache } from '../../types/models';

const USERSLISTKEY = "httpuserlist"

@Component({
    selector: 'app-usersList',
    templateUrl: './usersList.component.html',
    styleUrls: ['./usersList.component.scss']
})

export class UsersListComponent implements OnInit {
  focus: any;
  focus1: any;
  userCache: { [id: string]: TimestampObservableCache<any> };
  users: any;
  users$: any;

  constructor(private userService: UserService) { 
    this.userCache = {};
  }

  ngOnInit() {
    this.getUsers()
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

    console.log(permissions)
 }

  deleteUser(name, email, id){
    if (confirm(`Você tem certeza que deseja excluir o usuário ${name}?`)) {
      this.userService.deleteUser({id, email})
      this.users.users = this.users.users.filter(user => user._id != id);
    } else { 
      // Do nothing
    }
  }



}

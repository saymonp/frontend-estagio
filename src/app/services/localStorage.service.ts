import { Injectable } from '@angular/core';
 
@Injectable()
export class LocalStorageService {
 
    set(key, value) {
        localStorage.setItem(key, value);
    }
 
    get(key) {
        return localStorage.getItem(key);
    }
 
    remove(key) {
        localStorage.removeItem(key);
    }
}
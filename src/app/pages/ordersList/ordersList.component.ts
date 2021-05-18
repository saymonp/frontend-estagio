import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'app/services/localStorage.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';

const ORDERSLISTKEY = "ordersListHttp"

@Component({
    selector: 'app-ordersList',
    templateUrl: './ordersList.component.html',
    styleUrls: ['./ordersList.component.scss']
})

export class OrdersListComponent implements OnInit {
  focus: any;
  focus1: any;
  orders: Observable<any>;
  searchName: string;
  searchProduct: string;
  searchStatus: string;
  loading = false;

  constructor(private router: Router, private userData: LocalStorageService, private orderService: OrderService) { }

  ngOnInit() {
    if (this.tokenExpired(this.userData.get('token'))) {
      // token expired
      this.router.navigate(['/signin']);
    } else {
      this.getOrders();
    }
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  refresh() {
    this.deleteCacheItem();
    this.getOrders();
  }

  scrollToElement($element): void {
    // console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  getOrders() {
    this.loading = true;
    const chacheItem = this.getCacheItem();
    if (chacheItem) {
      // console.log('Retrieved item from cache');
      this.orders = chacheItem;
    }
    else {
      this.orderService.list().subscribe((data) => {
        if (data["errorMessage"] == "Unauthorized: Unauthorized: Unverified user"){
          alert("Operação não concluída, valide a conta pelo seu email");
          this.loading = false;
        } else if (data["statusCode"] && data["statusCode"] != 200) {
          alert("Ocorreu um erro")
          this.loading = false;
        } else {
      data.orders.reverse();
      this.orders = data;
      this.setCacheItem(data);
      this.loading = false;
        }
    },(err) => {
      this.loading = false;
      alert("Erro"); 
     });
    
    // console.log('Retrieved item from API');
  }
  }

  getCacheItem() {
    const cacheItem = JSON.parse(localStorage[ORDERSLISTKEY] || null)
    // console.log(cacheItem);
    if (!cacheItem) {
        return null;
    }

    // delete the cache item if it has expired
    if (cacheItem.expires <= Date.now()) {
        // console.log("item has expired");
        this.deleteCacheItem();
        return null;
    }
    this.loading = false;
    return cacheItem.data;
  }

  setCacheItem(data): void {
    const EXPIRES = Date.now() + 300000; // 5 min
    localStorage[ORDERSLISTKEY] = JSON.stringify({ expires: EXPIRES, data })
  }

  deleteCacheItem() {
      localStorage.removeItem(ORDERSLISTKEY)
  }

}

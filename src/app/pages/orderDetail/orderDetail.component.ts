import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'app/services/order.service';

@Component({
    selector: 'app-orderDetail',
    templateUrl: './orderDetail.component.html',
    styleUrls: ['./orderDetail.component.scss']
})

export class OrderDetailComponent implements OnInit {
  order: any;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(id);
    this.orderService.show(id).subscribe((data) => {
        this.order = data;
        console.log(this.order);
      });
      
     
  }

}


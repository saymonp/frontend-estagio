import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'app/services/order.service';

@Component({
    selector: 'app-orderDetail',
    templateUrl: './orderDetail.component.html',
    styleUrls: ['./orderDetail.component.scss']
})

export class OrderDetailComponent implements OnInit {
  order: any;
  orderForm: FormGroup;
  id: string;

  constructor(private router: Router, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.orderService.show(this.id).subscribe((data) => {
        this.order = data;
        console.log(this.order);

        this.orderForm = this.formBuilder.group({
          statusControl: [this.order.status]
        });
      });
  }

  update() {
    console.log(this.orderForm.value.statusControl, this.id);
    const status = this.orderForm.value.statusControl;
    const id = this.id;
    this.orderService.update({status, id}).subscribe((res) => {
      console.log(res);
    });
  }

  delete() {
    if (confirm("Você tem certeza que deseja excluir encomenda?")) {
      this.orderService.delete(this.id).subscribe((res) => {
        console.log(res);
        localStorage.removeItem("ordersListHttp")
        this.router.navigate(['/encomendas']);
      })
    } else { 
      // Do nothing
    }
  }

}


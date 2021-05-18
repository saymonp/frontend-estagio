import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'app/services/localStorage.service';
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
  loading = false;

  constructor(private userData: LocalStorageService, private router: Router, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit() {
    if (this.tokenExpired(this.userData.get('token'))) {
      // token expired
      this.router.navigate(['/signin']);
    }
    this.loading = true;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(this.id);
    this.orderService.show(this.id).subscribe((data) => {
        this.order = data;
        
        const shipping = [{code: "04510", name: "PAC"}, {code: "04014", name: "SEDEX"}, {code: "40169", name: "SEDEX 12"}, {code: "40215", name:"SEDEX 10"}]

        shipping.map((s) => {
          if (this.order.deliverMethod == s.code) {
            this.order.deliverMethod = s.name;
          }
        })

        // console.log(this.order);

        this.orderForm = this.formBuilder.group({
          statusControl: [this.order.status]
        });
        this.loading = false;
      },(err) => {
        this.loading = false;
        alert("Erro"); 
       });
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  update() {
    this.loading = true;
    // console.log(this.orderForm.value.statusControl, this.id);
    const status = this.orderForm.value.statusControl;
    const id = this.id;
    this.orderService.update({status, id}).subscribe((res) => {
      // console.log(res);
      if (res["errorMessage"] == "Unauthorized: Unauthorized: Unverified user"){
        alert("Operação não concluída, valide a conta pelo seu email");
      } else if (res["statusCode"] && res["statusCode"] != 200) {
        alert("Ocorreu um erro")
      } else {
      this.loading = false;
      }
    },(err) => {
      this.loading = false;
      alert("Erro"); 
     });
  }

  delete() {
    this.loading = true;
    if (confirm("Você tem certeza que deseja excluir encomenda?")) {
      this.orderService.delete(this.id).subscribe((res) => {
        // console.log(res);
        if (res["errorMessage"] == "Unauthorized: Unauthorized: Unverified user"){
          alert("Operação não concluída, valide a conta pelo seu email");
        } else if (res["statusCode"] && res["statusCode"] != 200) {
          alert("Ocorreu um erro")
        } else {
        localStorage.removeItem("ordersListHttp")
        this.loading = false;
        this.router.navigate(['/encomendas']);
        }
      
      },(err) => {
        this.loading = false;
        alert("Erro"); 
       })
    } else { 
      // Do nothing
    }
  }

}


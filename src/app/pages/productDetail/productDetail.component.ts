import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CorreioService } from 'app/services/correio.service';
import { OrderService } from 'app/services/order.service';
import { ProductService } from 'app/services/product.service';
import { first, take } from 'rxjs/operators';

export interface Delivery {
  nCdServico: string;
  sCepOrigem: string;
  sCepDestino: string;
  nVlPeso: string;
  nCdFormato: number;
  nVlComprimento: number;
  nVlAltura: number;
  nVlLargura: number;
  nVlDiametro: number;
}

@Component({
  selector: 'app-productDetail',
  templateUrl: './productDetail.component.html',
  styleUrls: ['./productDetail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  loading: boolean = false;
  loadingCor: boolean = false;
  id: string;
  orderForm: FormGroup;
  product: any = {};
  cepDestino: string;
  frete = 0;
  days = 0;
  localidade: any;
  state: any;
  cdServico: any = "04510";

  constructor(
    private correioService: CorreioService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private orderService: OrderService
  ) {}
  @Input() clientName: string;
  @Input() clientEmail: string;
  @Input() clientPhone: string;

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      clientName: ['', Validators.required],
      clientEmail: ['', Validators.required],
      clientPhone: ['', Validators.required],
      allowContact: ['', Validators.required],
      cepDestino: [null],
      cdServico: ["04510"],
      amount: [1]
  });


    this.loading = true;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.productService.show(this.id).subscribe(
      (data) => {
        this.product = data.product;
        console.log(this.product);
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        alert('Erro');
      }
    );
  }

  createOrder() {
    this.correioService.location(this.orderForm.value.cepDestino).subscribe((res) => {
      const cep = res.location.cep;
      const localidade = res.location.localidade;
      const state = res.location.uf;

      const order = {
        "title": this.product.title,
        "clientName": this.orderForm.value.clientName,
        "clientEmail": this.orderForm.value.clientEmail,
        "clientPhone": this.orderForm.value.clientPhone,
        "quoteOrder": false,
        "allowContact": this.orderForm.value.allowContact,
        "productId": this.product._id,
        "cep": cep,
        "location": localidade,
        "state": state,
        "deliverPrice": this.frete,
        "deliverMethod": this.orderForm.value.cdServico,
        "amount": this.orderForm.value.amount
      }
      console.log(order);
    })

    
    
    //this.orderService.create()
  }

  async calcDelivery() {
    this.loadingCor = true;
    console.log()
    const data: Delivery = {
      "nCdServico": this.orderForm.value.cdServico,
      "sCepOrigem": "98801010",
      "sCepDestino": this.orderForm.value.cepDestino,
      "nVlPeso": String(parseFloat(this.product.weightPacked) * this.orderForm.value.amount),
      "nCdFormato": this.product.formatPacked,
      "nVlComprimento": this.product.lengthPacked * this.orderForm.value.amount,
      "nVlAltura": this.product.heightPacked * this.orderForm.value.amount,
      "nVlLargura": this.product.widthPacked * this.orderForm.value.amount,
      "nVlDiametro": this.product.diameterPacked
    };

    const data1: Delivery = {
      "nCdServico": "04510",
      "sCepOrigem": "98801010",
      "sCepDestino": "98700000",
      "nVlPeso": "0.4",
      "nCdFormato": 1,
      "nVlComprimento": 15,
      "nVlAltura": 3,
      "nVlLargura": 10,
      "nVlDiametro": 0
      }
      
    console.log(data);
    this.correioService.shippingPrice(data).subscribe((res) => {
      this.frete = parseFloat(res.shipping[0].Valor);
      this.days = res.shipping[0].PrazoEntrega;
      this.loadingCor = false
    },
    (err) => {
      this.loadingCor = false;
    });
  }

}

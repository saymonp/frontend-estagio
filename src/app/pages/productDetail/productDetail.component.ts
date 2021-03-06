import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CorreioService } from 'app/services/correio.service';
import { MailService } from 'app/services/mail.service';
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
  days = {};
  localidade: any;
  state: any;
  cdServico: any = '04510';
  freteError = false;
  disableFrete = false;
  newAmount = 1;

  chosenOne: number;

  shipping = [];

  constructor(
    private mailService: MailService,
    private router: Router,
    private correioService: CorreioService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private orderService: OrderService
  ) {}
  @Input() clientName: string;
  @Input() clientEmail: string;
  @Input() clientPhone: string;
  @Input() amount: number;

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      clientName: ['', Validators.required],
      clientEmail: ['', Validators.required],
      clientPhone: ['', Validators.required],
      allowContact: [true],
      cepDestino: [null],
      shippingMethod: [null],
      amount: [1],
    });

    this.orderForm.get('cepDestino').valueChanges.subscribe((val) => {
      this.frete = 0;
      this.days = 0;
      this.shipping = [];
      this.chosenOne = null;
      this.orderForm.value.shippingMethod = null;
    });
    this.orderForm.get('amount').valueChanges.subscribe((val) => {
      this.frete = 0;
      this.days = 0;
      this.shipping = [];
      this.chosenOne = null;
      this.orderForm.value.shippingMethod = null;
    });

    this.loading = true;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(this.id);
    this.productService.show(this.id).subscribe(
      (data) => {
        this.product = data.product;
        // console.log(this.product);
        this.loading = false;
        if (this.product == null) {
          localStorage.removeItem('httpproductsList');
          this.router.navigate(['/trabalhos']);
        }
      },
      (err) => {
        this.loading = false;
        localStorage.removeItem('httpproductsList');
        this.router.navigate(['/trabalhos']);
      }
    );
  }

  async createOrder() {
    if (this.orderForm.value.shippingMethod == null) {
      //console.log(this.orderForm.value.shippingMethod);
      alert('Não esqueça de calcular o frete e selecionar um modo de entrega');
      return undefined;
    }
    if (
      (this.orderForm.value.cepDestino,
      this.orderForm.value.clientName &&
        this.orderForm.value.clientEmail &&
        this.orderForm.value.clientPhone &&
        this.orderForm.value.allowContact == true)
    ) {
      let cep = undefined;
      let localidade = undefined;
      let state = undefined;
      if (this.orderForm.value.cepDestino) {
        const res = await this.correioService
          .location(this.orderForm.value.cepDestino)
          .toPromise();
        cep = res.location.cep;
        localidade = res.location.localidade;
        state = res.location.uf;
      }
      this.loading = true;
      const order = {
        title: this.product.title,
        clientName: this.orderForm.value.clientName,
        clientEmail: this.orderForm.value.clientEmail,
        clientPhone: this.orderForm.value.clientPhone,
        quoteOrder: false,
        allowContact: this.orderForm.value.allowContact,
        productId: this.product._id,
        cep: cep ? cep : 'Não informado',
        location: localidade ? localidade : 'Não informado',
        state: state ? state : 'Não informado',
        deliverPrice: this.frete > 0 ? this.frete : 'A calcular',
        deliverMethod: this.orderForm.value.shippingMethod,
        amount: this.orderForm.value.amount,
      };
      //console.log(order);

      const response = await this.orderService.create(order).toPromise();
      this.loading = false;
      //console.log(response);
      if (response['statusCode'] && response['statusCode'] != 200) {
        alert('Ocorreu um erro');
        return undefined;
      }
      if (response.order_created) {
        this.sendEmail(
          response.order_created,
          this.orderForm.value.clientName,
          this.orderForm.value.clientEmail,
          this.orderForm.value.clientPhone
        );
        alert('Pedido enviado, obrigado!');
        this.loading = false;
      }
    } else {
      alert('Seu Nome, Email, Whatsapp e cep são obrigatórios');
    }
  }

  sendEmail(orderId, name, email, phone) {
    const subject = 'Pedido ' + this.product.title;

    let emailText = `Pedido do produto ${this.product.title}. \n\nCliente: ${name}\nEmail: ${email}\nWhatsapp: ${phone}\n\nEncomenda: https://bemaker.store/encomenda/${orderId}\n\n`;

    const emailToSend = {
      clientFirstName: name,
      clientLastName: '',
      clientEmail: email,
      subject: subject,
      message: emailText,
    };
    // console.log(emailToSend);
    // send email
    this.mailService.sendEmail(emailToSend).subscribe(
      (res) => {
        this.loading = false;
      },
      (err) => {
        this.sendEmail(orderId, name, email, phone);
        this.loading = false;
      }
    );
    this.loading = false;
    // console.log(emailToSend);
  }

  calcShippingCorreio() {
    this.loadingCor = true;
    let multiply = 1;
    if (this.product.formatPacked == 1) {
      const total =
        this.product.widthPacked +
        this.product.lengthPacked +
        this.product.heightPacked;
      // console.log(total);
      // console.log(total*this.orderForm.value.amount);
      if (total * this.orderForm.value.amount > 200) {
        this.newAmount = (total * this.orderForm.value.amount) / 200;
        multiply = 1;
        // console.log(this.newAmount);
        if (this.newAmount < 1) {
          this.newAmount = 2;
        }
      } else {
        multiply = this.orderForm.value.amount;
      }
    }

    if (this.product.formatPacked == 2) {
      if (
        (2 * this.product.diameterPacked + this.product.lengthPacked) *
          this.orderForm.value.amount >
        200
      ) {
        this.newAmount =
          (2 * this.product.diameterPacked +
            this.product.lengthPacked * this.orderForm.value.amount) /
          200;
        if (this.newAmount < 1) {
          this.newAmount = 2;
        }
        // console.log(this.newAmount);
        multiply = 1;
      } else {
        multiply = this.orderForm.value.amount;
      }
    }

    if (this.product.formatPacked == 3) {
      if (this.orderForm.value.amount * this.product.lengthPacked > 60) {
        this.newAmount =
          (this.orderForm.value.amount * this.product.lengthPacked) / 60;
        if (this.newAmount < 1.99) {
          this.newAmount = 2;
        }
        multiply = 1;
        // console.log(this.newAmount);
      } else {
        multiply = this.orderForm.value.amount;
      }
    }
    const data = {
      nCdServico: this.orderForm.value.cdServico,
      sCepOrigem: '98801010',
      sCepDestino: this.orderForm.value.cepDestino,
      nVlPeso: String(parseFloat(this.product.weightPacked) * multiply),
      nCdFormato: this.product.formatPacked,
      nVlLargura: this.product.widthPacked,
      nVlAltura: this.product.heightPacked,
      nVlComprimento: this.product.lengthPacked * multiply,
      nVlDiametro: this.product.diameterPacked,
    };
    // console.log(data)
    this.correioService.shippingPrice(data).subscribe(
      (res) => {
        if (res.shipping && parseFloat(res.shipping[0].Valor) > 0) {
          this.frete = parseFloat(res.shipping[0].Valor) * this.newAmount;
          this.days = res.shipping[0].PrazoEntrega;

          this.loadingCor = false;
          multiply = 1;
          this.newAmount = 1;
          this.loadingCor = false;
          this.freteError = false;
        } else {
          this.loadingCor = false;
          this.freteError = true;
          this.loadingCor = false;
          multiply = 1;
          this.newAmount = 1;
        }
      },
      (err) => {
        this.loadingCor = false;
        multiply = 1;
      }
    );
  }

  calcShipping() {
    this.loadingCor = true;
    this.chosenOne = null;
    this.orderForm.value.shippingMethod = null;
    const data = {
      cep: this.orderForm.value.cepDestino,
      weight: parseFloat(this.product.weightPacked),
      width: this.product.widthPacked,
      height: this.product.heightPacked,
      length: this.product.lengthPacked,
      quantity: this.orderForm.value.amount,
      price: this.product.price,
    };
    this.correioService.shippingMelhorPreco(data).subscribe(
      (res) => {
        console.log(res);
        this.shipping = res.filter(this.filterShipping);
        this.loadingCor = false;
      },
      (err) => {
        this.loadingCor = false;
      }
    );
  }

  filterShipping(s) {
    if (s['error']) {
      return false;
    } else {
      return true;
    }
  }

  chooseShipping(index) {
    this.chosenOne = index;
    //console.log(index, this.shipping.length);
    if (index == this.shipping.length) {
      this.frete = 0;
      this.days = {};
      this.orderForm.value.shippingMethod = 'Retirar em Mãos';
      //console.log(this.orderForm.value.shippingMethod);
    } else {
      this.frete = parseFloat(this.shipping[index].price);
      this.days = this.shipping[index].delivery_range;
      this.orderForm.value.shippingMethod = this.shipping[index].name;
      //console.log(this.orderForm.value.shippingMethod);
    }
  }
}

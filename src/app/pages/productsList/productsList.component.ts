import { Component, OnInit, HostListener, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { UploadService } from "../../services/upload.service";
import { MailService } from "../../services/mail.service";
import { OrderService } from "../../services/order.service";
import { LocalStorageService } from 'app/services/localStorage.service';
import { ProductService } from 'app/services/product.service';

const PRODUCTSLISTKEY = "httpproductsList";

@Component({
    selector: 'app-productsList',
    templateUrl: './productsList.component.html',
    styleUrls: ['./productsList.component.scss']
})

export class ProductsListComponent implements OnInit {
  doubleSlider = [0, 60];
  public filesToUpload = [];
  public imagesToUpload = [];
  orderForm: FormGroup;
  disabledSubmitButton: boolean = true;
  products = [];
  min = 0;
  max = 150;
  loading = false;
  private userPermissions = this.user.get('permissions') ? this.user.get('permissions').split(',') : [];

  constructor(private user: LocalStorageService, private orderService: OrderService, private productService: ProductService, private formBuilder: FormBuilder, private uploadService: UploadService, private mailService: MailService) { }

  @Input() clientName: string;
  @Input() clientEmail: string;
  @Input() clientPhone: string;

  @HostListener('input') onInput() {
    if (this.orderForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      clientName: ['', Validators.required],
      clientEmail: ['', Validators.required],
      clientPhone: ['', Validators.required],
      allowContact: ['', Validators.required],
      notes: [null],
      images: [null],
      files: [null],
      quoteOrder: [true]
  }); 
    this.getProducts();
  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }


  getProducts() {
    this.loading = true;
    const chacheItem = this.getCacheItem();
    if (chacheItem) {
      console.log('Retrieved item from cache');
      this.products = chacheItem;
      this.max = Math.ceil(Math.max.apply(Math, this.products.map(function(o) { return o.price; })));
      this.doubleSlider[1] = this.max;
    }
    else {
      this.productService.list().subscribe((data) => {
      this.products = data.products;
      this.setCacheItem(data.products);
      this.max = Math.ceil(Math.max.apply(Math, this.products.map(function(o) { return o.price; })));
      this.doubleSlider[1] = this.max;
      this.loading = false;
    },(err) => {
      this.loading = false;
      alert("Erro"); 
     });
    
    console.log('Retrieved item from API');
  }
  }

  getCacheItem() {
    const cacheItem = JSON.parse(localStorage[PRODUCTSLISTKEY] || null)
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
    this.loading = false;
    return cacheItem.data;
  }

  setCacheItem(data): void {
    const EXPIRES = Date.now() + 43200000; // 12h
    localStorage[PRODUCTSLISTKEY] = JSON.stringify({ expires: EXPIRES, data })
  }

  deleteCacheItem() {
      localStorage.removeItem(PRODUCTSLISTKEY)
  }


  removeFile(index) {
    this.filesToUpload.splice(index, 1);
  }

  removeImage(index) {
    this.imagesToUpload.splice(index, 1);
  }

  toUploadFile(event) {
    const fileList = event.target.files;

    for (const file of fileList) {
      if (file.name.endsWith("jpg") || file.name.endsWith("jpeg") || file.name.endsWith("png")) {
        this.imagesToUpload.push(file)
      } else {
      this.filesToUpload.push(file)
      }
    }
  }

  async createOrder() {
    try {

    if (this.orderForm.value.allowContact == false) {
      return alert("Você precisa permitir o contato.") 
    }
    if (!this.orderForm.valid) {
      return alert("Nome, E-mail, Whatsapp e Concordar com Política de Privacidade é obrigatório.") 
    }

    this.loading = true;
    
    const images = [];
    const files = [];

    for (let file of this.imagesToUpload){
      const img = await this.uploadFile(file);
      images.push(img);
    }

    for (let file of this.filesToUpload){
      const f = await this.uploadFile(file);
      files.push(f);
    }

    let valueSubmit = Object.assign({}, this.orderForm.value);
    console.log(images, files);
    valueSubmit.images = images;
    valueSubmit.files = files

    console.log("Value", valueSubmit);

    this.orderService.create(valueSubmit).subscribe((res) => { 
      console.log(res);
      this.sendEmail(res.order_created, images, files, valueSubmit.clientName, valueSubmit.clientEmail, valueSubmit.clientPhone, valueSubmit.notes)
    
    },(err) => {
      this.loading = false;
      alert("Erro ao enviar"); 
     });
    }
     catch (e) {
      this.loading = false;
      alert("Ocorreu um erro");
     }

  }

  sendEmail(orderId, images, files, name, email, phone, notes) {
    const subject = "Novo pedido de orçamento"
    const notesTosend = notes ? notes : "";

    let emailText = `Novo pedido de orçamento. \nCliente: ${name}\nEmail: ${email}\nWhatsapp: ${phone}\n${notesTosend}\nEncomenda: https://imobpoc.online/encomenda/${orderId}\n`
    console.log("Aqui", images)
    if (images && images.length > 0) {
      let imagesText = "Imagens:";
      images.map((img) => {
          imagesText = imagesText + `\n    ${img.file_url}`;
      });

      emailText = emailText + imagesText + "\n";
    }
    if (files && files.length > 0) {
      let filesText = "Arquivos:";
      files.map((f) => {
          filesText = filesText + `\n    ${f.file_url}`;
      });
      emailText = emailText + filesText + "\n";
    }

    const emailToSend = {
      "clientFirstName": name,
      "clientLastName": "",
      "clientEmail": email,
      "subject": subject,
      "message": emailText
    }
    console.log(emailToSend);
    // send email
    this.mailService.sendEmail(emailToSend).subscribe((res) => {
      alert("Seu pedido foi enviado")
      this.filesToUpload  = [];
      this.imagesToUpload = [];
      this.orderForm.get('notes').reset();
      this.loading = false;
    },(err) => {
      this.loading = false;
      alert("Erro ao enviar, tente novamente"); 
      });
    this.loading = false;
   console.log(emailToSend);

  }

  async uploadFile(file) {
    const fd = new FormData();
    
    const res = await this.uploadService.getPresignedUrl("orders/files", file.name).toPromise();
    
    fd.append("key", res.fields.key);
    fd.append("acl", res.fields.acl);
    
    fd.append("AWSAccessKeyId", res.fields.AWSAccessKeyId);
    fd.append("signature", res.fields.signature);
    fd.append("policy", res.fields.policy);
    fd.append('file', file, file.name);

    await this.uploadService.uploadFilePresignedUrl(res, fd).toPromise()
      
    return {"key": res.fields.key, "file_url": res.url+res.fields.key}
      
  }

  filterProducts(prod) {
    if (prod.orderAvailable == true) {
      return true;
    } else {
      return false;
    }
  }

}

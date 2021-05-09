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

@Component({
    selector: 'app-productsList',
    templateUrl: './productsList.component.html',
    styleUrls: ['./productsList.component.scss']
})

export class ProductsListComponent implements OnInit {
  doubleSlider = [20, 60];
  public filesToUpload = [];
  public imagesToUpload = [];
  orderForm: FormGroup;
  disabledSubmitButton: boolean = true;
  products = [];
  min = 0;
  max = 150;
  loading = false;
  private userPermissions = this.user.get('permissions') ? this.user.get('permissions').split(',') : [];

  constructor(private user: LocalStorageService, private orderService: OrderService, private formBuilder: FormBuilder, private uploadService: UploadService, private mailService: MailService) { }

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
    this.products = [{'_id': '608ce08a32a9c32438f4a7f4', 'title': 'product', 'price': 559.50, 'images': [{'key': '......', 'url': '....'}, {'key': '......', 'url': '....'}]}, {'_id': '608cf3ebcbf47d1de65c0515', 'title': 'product', 'price': 50.00, 'images': [{'key': '......', 'url': '....'}, {'key': '......', 'url': '....'}]}, {'_id': '608cf40f1cf843c3e20c7464', 'title': 'product', 'price': 55.00, 'images': [{'key': '......', 'url': '....'}, {'key': '......', 'url': '....'}]}, {'_id': '608cf4607b2ade0b5195be63', 'title': 'product', 'price': 40.00, 'images': [{'key': '......', 'url': '....'}, {'key': '......', 'url': '....'}]}, {'_id': '608cf477c2d5c9d05c7bc5e2', 'title': 'productUpdate', 'price': 30.00, 'images': [{'key': 'update', 'url': '....'}, {'key': '......', 'url': '....'}]}, {'_id': '608cf4b419e9c6e52f255238', 'title': 'product', 'price': 23.00, 'images': [{'key': '......', 'url': '....'}, {'key': '......', 'url': '....'}]}, {'_id': '608cf4e5667592446f093903', 'title': 'product', 'price': 20.00, 'images': [{'key': '......', 'url': '....'}, {'key': '......', 'url': '....'}]}, {'_id': '608cf5324dfb6537136d8f0a', 'title': 'productUpdate', 'price': 32.34, 'images': [{'key': 'update', 'url': '....'}, {'key': '......', 'url': '....'}]}]
    this.max = Math.ceil(Math.max.apply(Math, this.products.map(function(o) { return o.price; })));
  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  removeFile(index) {
    this.filesToUpload.splice(index, 1);
  }

  removeImage(index) {
    this.imagesToUpload.splice(index, 1);
  }

  uploadFile(event) {
    const fileList = event.target.files;


    for (const file of fileList) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      const that = this;
      reader.onload = function () {
        if (file.name.endsWith("jpg") || file.name.endsWith("jpeg") || file.name.endsWith("png")){
          that.imagesToUpload.push({"path": "orders/images/", "fileName":file.name, "data": reader.result});
        } else {
          that.filesToUpload.push({"path": "orders/files/", "fileName":file.name, "data": reader.result});
        }     
          }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };
      console.log(this.filesToUpload)
      console.log(this.imagesToUpload)
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
     
    const models3d = [];
    const images = [];
    
    for (let file of this.imagesToUpload) {
        const data = await this.uploadService.uploadFile(file).toPromise();
        images.push(JSON.parse(data.body))            
    }

    for (let file of this.filesToUpload) {
      const data = await this.uploadService.uploadFile(file).toPromise();
      models3d.push(JSON.parse(data.body))            
  }

    let valueSubmit = Object.assign({}, this.orderForm.value);

    valueSubmit.images = images;
    valueSubmit.files = models3d

    console.log("Value", valueSubmit);

    this.orderService.create(valueSubmit).subscribe((res) => {
      console.log(res);
      this.sendEmail(res.order_created, images, models3d, valueSubmit.clientName, valueSubmit.clientEmail, valueSubmit.clientPhone, valueSubmit.notes)
    
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
      this.loading = false;
    },(err) => {
      this.loading = false;
      alert("Erro ao enviar, tente novamente"); 
      });
    this.loading = false;
   console.log(emailToSend);

  }

}

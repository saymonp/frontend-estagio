import { Component, OnInit, HostListener, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UploadService } from "../../services/upload.service";
import { MailService } from "../../services/mail.service";
import { OrderService } from "../../services/order.service";

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {
  focus: any;
  focus1: any;
  public filesToUpload = [];
  public imagesToUpload = [];
  orderForm: FormGroup;
  loading = false;

  constructor(private orderService: OrderService, private formBuilder: FormBuilder, private uploadService: UploadService, private mailService: MailService) { }

  @Input() clientName: string;
  @Input() clientEmail: string;
  @Input() clientPhone: string;

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
  }

  scrollToElement($element): void {
    // console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
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
    // console.log(images, files);
    valueSubmit.images = images;
    valueSubmit.files = files

    // console.log("Value", valueSubmit);

    this.orderService.create(valueSubmit).subscribe((res) => { 
      // console.log(res);
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

    let emailText = `Novo pedido de orçamento. \n\nCliente: ${name}\nEmail: ${email}\nWhatsapp: ${phone}\nDescrição do Cliente: \n${notesTosend}\n\nEncomenda: https://bemaker.store/encomenda/${orderId}\n\n`
    // console.log("Aqui", images)
    if (images && images.length > 0) {
      let imagesText = "Imagens:";
      images.map((img) => {
          imagesText = imagesText + `\n    ${img.file_url.replace(" ", "%20")}`;
      });

      emailText = emailText + imagesText + "\n";
    }
    if (files && files.length > 0) {
      let filesText = "Arquivos:";
      files.map((f) => {
          filesText = filesText + `\n    ${f.file_url.replace(" ", "%20")}`;
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
    // console.log(emailToSend);
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
   // console.log(emailToSend);

  }

  async uploadFile(file) {
    const fd = new FormData();
    
    const res = await this.uploadService.getPresignedUrl("orders/files/", file.name).toPromise();
    
    fd.append("key", res.fields.key);
    fd.append("acl", res.fields.acl);
    
    fd.append("AWSAccessKeyId", res.fields.AWSAccessKeyId);
    fd.append("signature", res.fields.signature);
    fd.append("policy", res.fields.policy);
    fd.append('file', file, file.name);

    await this.uploadService.uploadFilePresignedUrl(res, fd).toPromise()
      
    return {"key": res.fields.key, "file_url": res.url+res.fields.key}
      
  }
  

}

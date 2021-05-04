import { Component, OnInit, HostListener, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UploadService } from "../../services/upload.service";
import { MailService } from "../../services/mail.service";

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

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService, private mailService: MailService) { }

  @Input() name: string;
  @Input() email: string;
  @Input() clientPhone: string;

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
        clientName: ['', Validators.required],
        clientEmail: ['', Validators.required],
        clientPhone: ['', Validators.required],
        allowContact: ['', Validators.required],
        notes: [null],
        images: [null],
        models3d: [null]
    });
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
    if (this.orderForm.value.allowContact == false) {
      return alert("Você precisa permitir o contato.") 
    }
    if (!this.orderForm.valid) {
      return alert("Nome, E-mail, Whatsapp e Concordar com Política de Privacidade é obrigatório.") 
    }
    else{

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
    valueSubmit.models3d = models3d

    console.log("Value", valueSubmit);

    // this.apartamentoService.addApartamento(valueSubmit).subscribe(() => {
    //   this.apartamentoService.showMessage('Apartamento criado!');
    //   this.router.navigate(['/lista-apartamento']);
    //
    // }(err) => {
      //this.loading = false;
      //alert("Erro ao enviar"); 
     // });

    this.sendEmail("123", images, models3d, this.orderForm.value.name, this.orderForm.value.email, this.orderForm.value.clientPhone, this.orderForm.value.notes)
    }
  }

  sendEmail(orderId, images, files, name, email, phone, notes) {
    const subject = "Novo pedido de orçamento"

    let emailText = `Novo pedido de orçamento. \nCliente: ${name}\nEmail: ${email}\nWhatsapp: ${phone}\n${notes}\nEncomenda: https://imobpoc.online/encomenda/${orderId}\n`
    console.log("Aqui", images)
    if (images && images.length > 0) {
      let imagesText = "Imagens:";
      images.map((img) => {
        console.log(img.file_url)
        console.log(img["file_url"])
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

    // send email
    this.mailService.sendEmail(emailToSend).subscribe((res) => {
      console.log(res);
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

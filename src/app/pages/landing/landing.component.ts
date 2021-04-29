import { Component, OnInit, HostListener, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

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
  disabledSubmitButton: boolean = true;

  constructor(private formBuilder: FormBuilder) { }

  @Input() name: string;
  @Input() email: string;
  @Input() clientPhone: string;

  @HostListener('input') onInput() {
    if (this.orderForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        clientPhone: ['', Validators.required],
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
          that.imagesToUpload.push({"path": "orders/images", "fileName":file.name, "data": reader.result});
        } else {
          that.filesToUpload.push({"path": "orders/files", "fileName":file.name, "data": reader.result});
        }     
          }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };
      console.log(this.filesToUpload)
      console.log(this.imagesToUpload)
  }

  createOrder() {
    if (!this.orderForm.valid) {
      
    }
    else{

    const models3d = [];
    const images = [];

    this.filesToUpload.map((file) => {
      // Upload file
      console.log(file);
      models3d.push({"file_url": "https....", "key": "....."})
    })

    this.imagesToUpload.map((file) => {
      // Upload file
      console.log(file);
      images.push({"file_url": "https....", "key": "....."})

  })
      
      
    
    let valueSubmit = Object.assign({}, this.orderForm.value);

    valueSubmit.images = images;
    valueSubmit.models3d = models3d

    console.log(valueSubmit);

    // this.apartamentoService.addApartamento(valueSubmit).subscribe(() => {
    //   this.apartamentoService.showMessage('Apartamento criado!');
    //   this.router.navigate(['/lista-apartamento']);
    // });
    }
  }

}

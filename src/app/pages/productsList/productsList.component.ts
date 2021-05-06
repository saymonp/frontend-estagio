import { Component, OnInit, HostListener, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

@Component({
    selector: 'app-productsList',
    templateUrl: './productsList.component.html',
    styleUrls: ['./productsList.component.scss']
})

export class ProductsListComponent implements OnInit {
  focus: any;
  focus1: any;
  doubleSlider = [20, 60];
  public filesToUpload = [];
  public imagesToUpload = [];
  orderForm: FormGroup;
  disabledSubmitButton: boolean = true;
  products = [];
  min = 0;
  max = 150;

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

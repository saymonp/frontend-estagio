import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CorreioService } from 'app/services/correio.service';
import { ProductService } from 'app/services/product.service';
import { UploadService } from 'app/services/upload.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'app/services/localStorage.service';

@Component({
    selector: 'app-createProduct',
    templateUrl: './createProduct.component.html',
    styleUrls: ['./createProduct.component.scss']
})

export class CreateProductComponent implements OnInit {
  focus: any;
  focus1: any;
  id: string;
  loading: boolean = false;
  loadingCor: boolean = false;
  loadingDel = false;

  images = [];
  files = [];
  frete: number;
  days: any;
  productForm: FormGroup;
  

  constructor(private userData: LocalStorageService, private formBuilder: FormBuilder, private correioService: CorreioService, private productService: ProductService, private router: Router, private uploadService: UploadService) { }

  ngOnInit() {
    if (this.tokenExpired(this.userData.get('token'))) {
      // token expired
      console.log("Token invalido")
      this.router.navigate(['/signin']);
    } 
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: [0, Validators.required],
      width: [0, Validators.required],
      height: [0, Validators.required],
      orderAvailable: [true, Validators.required],
      description: ['', Validators.required],
      images: [null],
      files: [null],
      heightPacked: [0, Validators.required],
      weightPacked: [0, Validators.required],
      widthPacked: [0, Validators.required],
      diameterPacked: [0, Validators.required],
      lengthPacked: [0, Validators.required],
      formatPacked: [1, Validators.required],
      // Test
      cepTest: "98700000",
      cdServico: ["04510"],
      amount: [1]
  });
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  async createProduct() {
    this.productForm.value.images = this.images;
    this.productForm.value.files = this.files;

    let valueSubmit = Object.assign({}, this.productForm.value);
    valueSubmit.weightPacked = String(valueSubmit.weightPacked)
    delete valueSubmit.cepTest
    delete valueSubmit.cdServico
    delete valueSubmit.amount 

    console.log(valueSubmit);

    const response = await this.productService.create(valueSubmit).toPromise()
    if (response["statusCode"] && response["statusCode"] != 200) {
      alert("Ops");
    } else {
      console.log(response);
      this.router.navigate(['/trabalhos']);
    }
  }

  uploadFile(event) {
    const filesToUpload = <Array<File>>event.target.files;

    for (const file of filesToUpload) {
      const fd = new FormData();
      
      this.uploadService.getPresignedUrl("products/files", file.name).subscribe((res) => {
        fd.append("key", res.fields.key);
        fd.append("acl", res.fields.acl);
        
        fd.append("AWSAccessKeyId", res.fields.AWSAccessKeyId);
        fd.append("signature", res.fields.signature);
        fd.append("policy", res.fields.policy);
        fd.append('file', file, file.name);

        this.uploadService.uploadFilePresignedUrl(res, fd).subscribe((response) => {
          if (response.status == 204) {
            this.files.push({"fileName": file.name, "file":{"key": res.fields.key, "file_url": res.url+res.fields.key}})
          }
        })
      })
  }
  }

  uploadImage(event) {
    const filesToUpload = <Array<File>>event.target.files;

    for (const file of filesToUpload) {
      if (file.name.endsWith("jpg") || file.name.endsWith("jpeg") || file.name.endsWith("png")) {
      const fd = new FormData();
      
      this.uploadService.getPresignedUrl("products/images", file.name).subscribe((res) => {
        fd.append("key", res.fields.key);
        fd.append("acl", res.fields.acl);
        
        fd.append("AWSAccessKeyId", res.fields.AWSAccessKeyId);
        fd.append("signature", res.fields.signature);
        fd.append("policy", res.fields.policy);
        fd.append('file', file, file.name);

        this.uploadService.uploadFilePresignedUrl(res, fd).subscribe((response) => {
          if (response.status == 204) { 
            this.images.push({"key": res.fields.key, "file_url": res.url+res.fields.key})
          }
        })
      })
    } else {
      alert("Imagem inválida " +file.name) 
    }
  }
  console.log(this.images);
  }

  deleteImage(index) {
    const key = this.images[index].key
    this.uploadService.deleteFile(key).subscribe((res) => {
      this.images.splice(index, 1);
    })
  }

  removeFile(index) {
    const key = this.files[index].file.key
    this.uploadService.deleteFile(key).subscribe((res) => {
      this.files.splice(index, 1);
    })
  }

  moveImageToTop(old_index) { 
    console.log(old_index);
    const new_index = 0;
    if (new_index >= this.images.length) {
      let k = new_index - this.images.length + 1;
      while (k--) {
        this.images.push(undefined);
      }
    }
    this.images.splice(new_index, 0, this.images.splice(old_index, 1)[0]);
  }

  async cancel() {
    this.loadingDel = true;
    for (let image of this.images) {
      await this.uploadService.deleteFile(image.key).toPromise();
    }

    for (let file of this.files) {
      await this.uploadService.deleteFile(file.key).toPromise();
    }
    this.loadingDel = false;
    this.router.navigate(['/']);
  }

  calcDelivery() {
    this.loadingCor = true;
    const data1 = {
      "nCdServico": "04510",
      "sCepOrigem": "98801010",
      "sCepDestino": "98700000",
      "nVlPeso": "1.0",
      "nCdFormato": 1,
      "nVlComprimento": 27.0,
      "nVlAltura": 8.0,
      "nVlLargura": 10.0,
      "nVlDiametro": 18.0
      }

      const data = {
        "nCdServico": this.productForm.value.cdServico,
        "sCepOrigem": "98801010",
        "sCepDestino": this.productForm.value.cepTest,
        "nVlPeso": this.productForm.value.weightPacked,
        "nCdFormato": this.productForm.value.formatPacked,
        "nVlComprimento": this.productForm.value.widthPacked,
        "nVlAltura": this.productForm.value.heightPacked,
        "nVlLargura": this.productForm.value.lengthPacked,
        "nVlDiametro": this.productForm.value.diameterPacked
        }
      
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

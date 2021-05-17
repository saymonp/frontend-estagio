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
  newAmount = 1;

  constructor(private userData: LocalStorageService, private formBuilder: FormBuilder, private correioService: CorreioService, private productService: ProductService, private router: Router, private uploadService: UploadService) { }

  ngOnInit() {
    if (this.tokenExpired(this.userData.get('token'))) {
      // token expired
      console.log("Token invalido")
      this.router.navigate(['/signin']);
    } 
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: [null, Validators.required],
      width: [null, Validators.required],
      height: [null, Validators.required],
      orderAvailable: [true, Validators.required],
      description: ['', Validators.required],
      images: [null],
      files: [null],
      heightPacked: [null, Validators.required],
      weightPacked: [null, Validators.required],
      widthPacked: [null, Validators.required],
      diameterPacked: [null, Validators.required],
      lengthPacked: [null, Validators.required],
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
    this.loading = true;
    this.productForm.value.images = this.images;

    this.productForm.value.files = [];

    this.files.map((file) => {
      this.productForm.value.files.push(file.file)
    })

    let valueSubmit = Object.assign({}, this.productForm.value);
    valueSubmit.weightPacked = String(valueSubmit.weightPacked)
    delete valueSubmit.cepTest
    delete valueSubmit.cdServico
    delete valueSubmit.amount 

    console.log(valueSubmit); 

    const response = await this.productService.create(valueSubmit).toPromise()
    if (response["statusCode"] && response["statusCode"] != 200) {
      if (response["errorMessage"] == "Unauthorized: Unauthorized: Unverified user"){
        alert("Operação não concluída, valide a conta pelo seu email");
      }else {
      this.loading = false;
      alert("Ops");
      }
    } else {
      this.loading = false;
      console.log(response);
      localStorage.removeItem("httpproductsList")
      this.router.navigate(['/trabalhos']);
    }
  }

  uploadFile(event) {
    const filesToUpload = <Array<File>>event.target.files;

    for (const file of filesToUpload) {
      const fd = new FormData();
      
      this.uploadService.getPresignedUrl("products/files/", file.name).subscribe((res) => {
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
      
      this.uploadService.getPresignedUrl("products/images/", file.name).subscribe((res) => {
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
    let multiply = 1;
    if (this.productForm.value.formatPacked == 1) {
      if (14 > this.productForm.value.lengthPacked || this.productForm.value.lengthPacked > 100) {
        alert("Comprimento embalado precisa ser 15cm a 100cm")
      }

      if (14 > this.productForm.value.widthPacked  || this.productForm.value.widthPacked  > 100) {
        alert("Largura embalado precisa ser 15cm a 100cm")
      }

      if (0 > this.productForm.value.heightPacked || this.productForm.value.heightPacked > 100) {
        alert("Altura embalado precisa ser 1cm a 100cm")
      }
      const total = this.productForm.value.widthPacked+this.productForm.value.lengthPacked + this.productForm.value.heightPacked
      if (25 > total) {
        alert("A soma total da embalagem, Comprimento+Largura+Altura deeve ser no mínimo 26")
      }

      if (total > 200) {
        alert("A soma total da embalagem, Comprimento+Largura+Altura deeve ser no máximo 200")
      }
      if (total*this.productForm.value.amount > 200) {
        this.newAmount = (total*this.productForm.value.amount) / 200;
        console.log(this.newAmount);
        if(this.newAmount < 1.99) {
          this.newAmount = 2;
        }
      } else {
        multiply = this.productForm.value.amount;
      }

    }

    if (this.productForm.value.formatPacked == 2) {
      if (17 > this.productForm.value.lengthPacked || this.productForm.value.lengthPacked > 100) {
        alert("Comprimento embalado precisa ser 18cm a 100cm")
      }
      if (4 > this.productForm.value.diameterPacked || this.productForm.value.diameterPacked > 100) {
        alert("Diametro embalado precisa ser 5cm a 91cm")
      }
      if (2* this.productForm.value.diameterPacked+this.productForm.value.lengthPacked > 200) {
        alert("2 * Diametro + Comprimento embalado precisa ser entre 28cm a 200cm")
      }
      if ((2* this.productForm.value.diameterPacked+this.productForm.value.lengthPacked)*this.productForm.value.amount > 200) {
        this.newAmount = ((2* this.productForm.value.diameterPacked)+this.productForm.value.lengthPacked*this.productForm.value.amount) / 200;
        if(this.newAmount < 1.99) {
          this.newAmount = 2;
        }
        console.log(this.newAmount);
        multiply = 1;
      } else {
        multiply = this.productForm.value.amount;
      }
    }

    if (this.productForm.value.formatPacked == 3) {
      if (10 > this.productForm.value.widthPacked || this.productForm.value.widthPacked > 60) {
        alert("Largura embalado precisa ser 10cm a 60cm")
      }
      if (15 > this.productForm.value.lengthPacked || this.productForm.value.lengthPacked > 60) {
        alert("Comprimento embalado precisa ser 16cm a 60cm")
      }
      if (this.productForm.value.amount*this.productForm.value.lengthPacked > 60) {
        this.newAmount = this.productForm.value.amount*this.productForm.value.lengthPacked / 60;
        if(this.newAmount < 1.99) {
          this.newAmount = 2;
        }
        multiply = 1;
        console.log(this.newAmount);
      } else {
        multiply = this.productForm.value.amount;
      }
    }



      const data = {
        "nCdServico": this.productForm.value.cdServico,
        "sCepOrigem": "98801010",
        "sCepDestino": this.productForm.value.cepTest,
        "nVlPeso": String(parseFloat(this.productForm.value.weightPacked) * multiply),
        "nCdFormato": this.productForm.value.formatPacked,
        "nVlLargura": this.productForm.value.widthPacked * multiply,
        "nVlAltura": this.productForm.value.heightPacked * multiply,
        "nVlComprimento": this.productForm.value.lengthPacked * multiply,
        "nVlDiametro": this.productForm.value.diameterPacked 
        }
      
    this.correioService.shippingPrice(data).subscribe((res) => {
      this.frete = parseFloat(res.shipping[0].Valor)*this.newAmount;
      this.days = res.shipping[0].PrazoEntrega;
      this.loadingCor = false
      multiply = 1;
      this.newAmount = 1;
    },
    (err) => {
      this.loadingCor = false;
      multiply = 1;
    });
  }

}

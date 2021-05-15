import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/services/product.service';
import { UploadService } from 'app/services/upload.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CorreioService } from 'app/services/correio.service';
import { LocalStorageService } from 'app/services/localStorage.service';

@Component({
    selector: 'app-updateProduct',
    templateUrl: './updateProduct.component.html',
    styleUrls: ['./updateProduct.component.scss']
})

export class UpdateProductComponent implements OnInit {
  focus: any;
  focus1: any;
  id: string;
  loading: boolean = false;
  product: any;
  //images = [{key: "products/images90108c45-791e-4bff-8431-0a6258004f6a1.jpg", file_url: "https://estagio-uploads.s3.amazonaws.com/products/images90108c45-791e-4bff-8431-0a6258004f6a1.jpg", new: true}];
  // files = [];
  imagesToDelete = [];
  filesToDelete = [];
  productForm: FormGroup;
  loadingCor: boolean = false;
  frete: number;
  days: any;
  loadingDel = false;
  newAmount = 1;

  constructor(private userData: LocalStorageService, private correioService: CorreioService, private formBuilder: FormBuilder, private uploadService: UploadService, private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit() {
    if (this.tokenExpired(this.userData.get('token'))) {
      // token expired
      this.router.navigate(['/signin']);
    }
    this.loading = true;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.productService.show(this.id).subscribe(
      (data) => {
        this.product = data.product;
        console.log(this.product.images);
        this.createForm();
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        alert('Erro');
      }
    );
  }

  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  createForm() {
    console.log(this.productForm);
    this.productForm = this.formBuilder.group({
      title: [this.product.title, Validators.required],
      price: [this.product.price, Validators.required],
      width: [this.product.width, Validators.required],
      height: [this.product.height, Validators.required],
      orderAvailable: [this.product.orderAvailable, Validators.required],
      description: [this.product.description, Validators.required],
      images: [null],
      files: [null],
      heightPacked: [this.product.heightPacked, Validators.required],
      weightPacked: [this.product.weightPacked, Validators.required],
      widthPacked: [this.product.widthPacked, Validators.required],
      diameterPacked: [this.product.diameterPacked, Validators.required],
      lengthPacked: [this.product.lengthPacked, Validators.required],
      formatPacked: [this.product.formatPacked, Validators.required],
      productId: [this.id],
      // Test
      cepTest: "98700000",
      cdServico: ["04510"],
      amount: [1]
  });
  }

  async updateProduct() {
    this.loading = true;
    let valueSubmit = Object.assign({}, this.productForm.value);
    for (let img of this.product.images) {
      if (img['new']) delete img['new'];
    }
    for (let f of this.product.files) {
      if (f['new']) delete f['new'];
    }
    valueSubmit.images = this.product.images;
    valueSubmit.files = this.product.files;
    delete valueSubmit.cepTest
    delete valueSubmit.cdServico
    delete valueSubmit.amount 

    console.log(valueSubmit);
    const response = await this.productService.update(valueSubmit).toPromise()
    this.loading = false;
    if (response["statusCode"] && response["statusCode"] != 200) {
      alert("Ops");
    } else {
    console.log(response);
    localStorage.removeItem("httpproductsList");
    this.router.navigate(['/trabalhos']);
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
            this.product.images.push({"key": res.fields.key, "file_url": res.url+res.fields.key, "new": true})
          }
        })
      })
    } else {
      alert("Imagem inválida " +file.name) 
    }
  }
  console.log(this.product.images);
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
            this.product.files.push({"key": res.fields.key, "file_url": res.url+res.fields.key, "new": true})
          }
        })
      })
  }
  console.log(this.product.images);
  }

  moveImageToTop(old_index) { 
    console.log(old_index);
    const new_index = 0;
    if (new_index >= this.product.images.length) {
      let k = new_index - this.product.images.length + 1;
      while (k--) {
        this.product.images.push(undefined);
      }
    }
    this.product.images.splice(new_index, 0, this.product.images.splice(old_index, 1)[0]);
  }

  removeImage(index) {
    this.product.imagesToDelete.push(this.product.images[index]);
    this.product.images.splice(index, 1);
  }

  removeFile(index) {
    this.filesToDelete.push(this.product.images[index]);
    this.product.files.splice(index, 1);
  }

  async deleteFiles() {
    this.loadingDel = true;
    for (let image of this.imagesToDelete) {
      await this.uploadService.deleteFile(image.key).toPromise();
    }

    for (let file of this.filesToDelete) {
      await this.uploadService.deleteFile(file.key).toPromise();
    }
    this.loadingDel = false;
    this.router.navigate(['/']);
  }

  deleteProduct() {
    if (confirm("Você tem certeza que deseja excluir esse produto?")) {
      this.loading = true;
      this.productService.delete(this.id).subscribe((res)=> {
        console.log(res);
        this.loading = false;
        localStorage.removeItem("httpproductsList");
        this.router.navigate(['/trabalhos']);
      },(err) => {
        this.loading = false;
        alert("Erro"); 
       })
    } else { 
      // Do nothing
    }
    
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
        if(this.newAmount < 1) {
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
        if(this.newAmount < 1) {
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

  async cancel() {
    this.loadingDel = true;

    for (let img of this.product.images) {
      if (img["new"] == true) {
        console.log(img)
        await this.uploadService.deleteFile(img.key).toPromise();
      }
    }

    for (let f of this.product.files) {
      if (f["new"] == true) {
        console.log(f)
        await this.uploadService.deleteFile(f.key).toPromise();
      }
    }

    this.loadingDel = false;
    this.router.navigate(['/']);
  }

}

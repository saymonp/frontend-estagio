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
      // Test
      cepTest: "98700000",
      cdServico: ["04510"],
      amount: [1]
  });
  }

  async updateProduct() {
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
    if (response["statusCode"] && response["statusCode"] != 200) {
      alert("Ops");
    }
    console.log(response);
    this.router.navigate(['/trabalhos']);
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
      if (file.name.endsWith("jpg") || file.name.endsWith("jpeg") || file.name.endsWith("png")) {
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
        "nVlComprimento": this.productForm.value.lengthPacked,
        "nVlAltura": this.productForm.value.heightPacked,
        "nVlLargura": this.productForm.value.widthPacked,
        "nVlDiametro": this.productForm.value.diameterPacked
        }
      console.log(data)
    this.correioService.shippingPrice(data).subscribe((res) => {
      this.frete = parseFloat(res.shipping[0].Valor);
      this.days = res.shipping[0].PrazoEntrega;
      this.loadingCor = false
    },
    (err) => {
      this.loadingCor = false;
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

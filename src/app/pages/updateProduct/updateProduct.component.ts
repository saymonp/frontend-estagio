import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/services/product.service';
import { UploadService } from 'app/services/upload.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CorreioService } from 'app/services/correio.service';

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
  images = [];
  files = [];
  imagesToDelete = [];
  filesToDelete = [];
  productForm: FormGroup;
  loadingCor: boolean = false;
  frete: number;
  days: any;

  constructor(private correioService: CorreioService, private formBuilder: FormBuilder, private uploadService: UploadService, private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit() {
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

    this.loading = true;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    this.productService.show(this.id).subscribe(
      (data) => {
        this.product = data.product;
        console.log(this.product);
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        alert('Erro');
      }
    );
  }

  updateProduct() {
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
            this.product.images.push({"key": res.fields.key, "file_url": res.url+res.fields.key})
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
            this.product.images.push({"key": res.fields.key, "file_url": res.url+res.fields.key})
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
    this.files.splice(index, 1);
  }

  deleteFiles() {
    this.product.imagesToDelete.map((file) => {
      this.uploadService.deleteFile(file.key).subscribe();
    });
    this.filesToDelete.map((file) => {
      this.uploadService.deleteFile(file.key).subscribe();
    })
  }

  deleteProduct() {
    this.loading = true;
    if (confirm("Você tem certeza que deseja excluir esse produto?")) {
      this.productService.delete(this.id).subscribe((res)=> {
        console.log(res);
        this.loading = false;
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

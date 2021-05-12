import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/services/product.service';
import { UploadService } from 'app/services/upload.service';

@Component({
    selector: 'app-createProduct',
    templateUrl: './createProduct.component.html',
    styleUrls: ['./createProduct.component.scss']
})

export class CreateProductComponent implements OnInit {
  focus: any;
  focus1: any;
  doubleSlider = [20, 60];
  state_default: boolean = true;
  id: string;
  loading: boolean;

  images = [];
  files = [];

  constructor(private productService: ProductService, private router: Router, private uploadService: UploadService) { }

  ngOnInit() {}

  createProduct() {
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

  async uploadImage(event) {
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

  cancel() {
    this.images.map((image) => {
      this.uploadService.deleteFile(image.key);
    });
    this.router.navigate(['/']);
  }

}

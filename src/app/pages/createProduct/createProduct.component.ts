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
  aa: any;

  constructor(private productService: ProductService, private router: Router, private uploadService: UploadService) { }

  ngOnInit() {}

  createProduct() {
  }

  async uploadFile(event) {
    const fileList = event.target.files;

    for (let file of fileList) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      this.uploadService.getPresignedUrl("products/images/", file.name).subscribe((res) => {
        console.log(res);
      })

    }
  }

  async uploadImage(event) {
    const filesToUpload = <Array<File>>event.target.files;

    for (const file of filesToUpload) {
      const fd = new FormData();
      
      
      //const reader = new FileReader();

      // reader.readAsArrayBuffer(file);
      // const that = this;
      // reader.onload = function () {
      //     that.aa = reader.result;
            
      //     }
      //   reader.onerror = function (error) {
      //       console.log('Error: ', error);
      //   };
      
      this.uploadService.getPresignedUrl("product/images", file.name).subscribe((res) => {
        //const files = {"file": this.aa}
        //console.log(JSON.stringify(res.fields));
        //fd.append("fields", JSON.stringify(res.fields));
        //console.log("a", fd);
        let params = new HttpParams();
        fd.append("key", res.fields.key);
        fd.append("acl", res.fields.acl);
        
        fd.append("AWSAccessKeyId", res.fields.AWSAccessKeyId);
        fd.append("signature", res.fields.signature);
        fd.append("policy", res.fields.policy);
        fd.append('file', file, file.name);
        
        const httpHeaders = {
          headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
        }; 
        this.uploadService.uploadFilePresignedUrl(res, fd).subscribe((response) => {
          console.log(response);
        })
      })
  }
}

  deleteImage(index) {
    const key = this.images[index].key
    this.uploadService.deleteFile(key).subscribe((res) => {
      // if res ok
      this.images.splice(index, 1);
    })
  }

  moveImageToTop(old_index) {
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

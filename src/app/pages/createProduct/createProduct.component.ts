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

  async uploadFile(event) {
    const fileList = event.target.files;

    for (let file of fileList) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      const that = this;
      reader.onload = async function () {
        const data = await that.uploadService.uploadFile({"path": "products/files/", "fileName": file.name, "data": reader.result}).toPromise();
        that.files.push(JSON.parse(data.body))  
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };    
    }
  }

  async uploadImage(event) {
    const filesToUpload = <Array<File>>event.target.files;

    for (const file of filesToUpload) {
      const fd = new FormData();
      fd.append('file', file);
      this.uploadService.getPresignedUrl("product%images", file.name)
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

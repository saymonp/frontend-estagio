import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-productsList',
    templateUrl: './productsList.component.html',
    styleUrls: ['./productsList.component.scss']
})

export class ProductsListComponent implements OnInit {
  focus: any;
  focus1: any;
  doubleSlider = [20, 60];
  state_default: boolean = true;
  public filesToUpload = [];

  constructor() { }

  ngOnInit() {}

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  createOrder() {
    this.filesToUpload.map((file) => {
      console.log(file)
      // Upload
    })

    // Create Order
  }

  removeFile(index) {
    this.filesToUpload.splice(index, 1);
  }

  uploadImage(event) {
    const fileList = event.target.files;


    for (const file of fileList) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      const that = this;
      reader.onload = function () {
        that.filesToUpload.push({"path": "orders/", "fileName":file.name, "data": reader.result})
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };
      console.log(this.filesToUpload)
  }

}

}

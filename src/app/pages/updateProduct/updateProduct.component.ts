import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/services/product.service';

@Component({
    selector: 'app-updateProduct',
    templateUrl: './updateProduct.component.html',
    styleUrls: ['./updateProduct.component.scss']
})

export class UpdateProductComponent implements OnInit {
  focus: any;
  focus1: any;
  doubleSlider = [20, 60];
  state_default: boolean = true;
  id: string;
  loading: boolean;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  showProduct() {

  }

  updateProduct() {
    
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

}

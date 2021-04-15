import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';
import { NouisliderModule } from 'ng2-nouislider';

import { LandingComponent } from './landing/landing.component';
import { ProductsListComponent } from './productsList/productsList.component';
import { ProductDetailComponent } from './productDetail/productDetail.component';
import { CreateProductComponent } from './createProduct/createProduct.component';
import { RouterModule } from '@angular/router';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        LazyLoadImageModule,
        NouisliderModule,
        RouterModule,
    ],
    providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }],
    declarations: [
        LandingComponent,
        ProductsListComponent,
        ProductDetailComponent,
        CreateProductComponent
    ]
})
export class PagesModule { }

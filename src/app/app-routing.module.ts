import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';

import { LandingComponent } from './pages/landing/landing.component';
import { ProductsListComponent } from './pages/productsList/productsList.component';
import { ProductDetailComponent } from './pages/productDetail/productDetail.component';
import { CreateProductComponent } from './pages/createProduct/createProduct.component';
import { UpdateProductComponent } from './pages/updateProduct/updateProduct.component';



const routes: Routes = [
  
  { path: '',          component: LandingComponent },
  { path: 'trabalhos',          component: ProductsListComponent },
  { path: 'trabalho/:id',       component: ProductDetailComponent },
  { path: 'criar-trabalho',     component: CreateProductComponent },
  { path: 'atualizar-trabalho/:id',     component: UpdateProductComponent },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }

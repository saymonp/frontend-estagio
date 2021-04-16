import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';

import { LandingComponent } from './pages/landing/landing.component';
import { ProductsListComponent } from './pages/productsList/productsList.component';
import { ProductDetailComponent } from './pages/productDetail/productDetail.component';
import { CreateProductComponent } from './pages/createProduct/createProduct.component';
import { UpdateProductComponent } from './pages/updateProduct/updateProduct.component';
import { SignupComponent } from './pages/signup/signup.component';
import { Page404Component } from './pages/page404/page404.component';



const routes: Routes = [
  
  { path: '',          component: LandingComponent },
  { path: 'trabalhos',          component: ProductsListComponent },
  { path: 'trabalho/:id',       component: ProductDetailComponent },
  { path: 'criar-trabalho',     component: CreateProductComponent },
  { path: 'atualizar-trabalho/:id',     component: UpdateProductComponent },
  { path: 'signup',     component: SignupComponent },
  {
    path        : '**',
    pathMatch   : 'full',
    component   : Page404Component
}
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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';

import { LandingComponent } from './pages/landing/landing.component';
import { ProductsListComponent } from './pages/productsList/productsList.component';
import { ProductDetailComponent } from './pages/productDetail/productDetail.component';

const routes: Routes = [
  
  { path: '',          component: LandingComponent },
  { path: 'trabalhos',          component: ProductsListComponent },
  { path: 'trabalho/:id',          component: ProductDetailComponent },
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

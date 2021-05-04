import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';

import { AuthGuard } from './services/guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptors/interceptor.service';
import { LandingComponent } from './pages/landing/landing.component';
import { ProductsListComponent } from './pages/productsList/productsList.component';
import { ProductDetailComponent } from './pages/productDetail/productDetail.component';
import { CreateProductComponent } from './pages/createProduct/createProduct.component';
import { UpdateProductComponent } from './pages/updateProduct/updateProduct.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ChangePasswordComponent } from './pages/changePassword/changePassword.component';
import { UsersListComponent } from './pages/usersList/usersList.component';
import { OrdersListComponent } from './pages/ordersList/ordersList.component';
import { OrderDetailComponent } from './pages/orderDetail/orderDetail.component';
import { OrderComponent } from './pages/order/order.component';
import { Page404Component } from './pages/page404/page404.component';



const routes: Routes = [
  
  { path: '',          component: LandingComponent },
  { path: 'trabalhos',          component: ProductsListComponent },
  { path: 'trabalho/:id',       component: ProductDetailComponent },
  { path: 'criar-trabalho',     component: CreateProductComponent, canActivate: [AuthGuard], data: { permissions: ['create:product'] } },
  { path: 'atualizar-trabalho/:id',     component: UpdateProductComponent, canActivate: [AuthGuard], data: { permissions: ['update:product'] } },
  { path: 'signup',     component: SignupComponent, canActivate: [AuthGuard], data: { permissions: ['create:user'] } },
  { path: 'signin',     component: SigninComponent },
  { path: 'change-password/:passwordResetToken',     component: ChangePasswordComponent },
  { path: 'funcionarios',     component: UsersListComponent, canActivate: [AuthGuard], data: { permissions: ['update:user', 'delete:user'] } },
  { path: 'encomendas',     component: OrdersListComponent, canActivate: [AuthGuard], data: { permissions: [] } },
  { path: 'encomenda/:id',     component: OrderDetailComponent, canActivate: [AuthGuard], data: { permissions: [] } },
  { path: 'encomendar',     component: OrderComponent },
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
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
})
export class AppRoutingModule { }

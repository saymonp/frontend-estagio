import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';
import { NouisliderModule } from 'ng2-nouislider';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { LandingComponent } from './landing/landing.component';
import { ProductsListComponent } from './productsList/productsList.component';
import { ProductDetailComponent } from './productDetail/productDetail.component';
import { CreateProductComponent } from './createProduct/createProduct.component';
import { UpdateProductComponent } from './updateProduct/updateProduct.component';
import { Page404Component } from './page404/page404.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { UsersListComponent } from './usersList/usersList.component';
import { OrdersListComponent } from './ordersList/ordersList.component';
import { OrderDetailComponent } from './orderDetail/orderDetail.component';
import { OrderComponent } from './order/order.component';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from 'app/services/localStorage.service';
import { CallbackPipe } from 'app/helpers/callback.pipe';
import { FilterPipe } from 'app/helpers/filter.pipe';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        LazyLoadImageModule,
        NouisliderModule,
        RouterModule,
        HttpClientModule,
        NgxMaskModule.forRoot()
    ],
    providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }, LocalStorageService],
    declarations: [
        FilterPipe,
        CallbackPipe,
        LandingComponent,
        ProductsListComponent,
        ProductDetailComponent,
        CreateProductComponent,
        UpdateProductComponent,
        SignupComponent,
        SigninComponent,
        ChangePasswordComponent,
        UsersListComponent,
        OrdersListComponent,
        OrderDetailComponent,
        OrderComponent,
        Page404Component
    ]
})
export class PagesModule { }

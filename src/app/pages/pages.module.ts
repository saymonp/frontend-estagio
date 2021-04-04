import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';
import { NouisliderModule } from 'ng2-nouislider';

import { LandingComponent } from './landing/landing.component';
import { ProductsListComponent } from './productsList/productsList.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        LazyLoadImageModule,
        NouisliderModule
    ],
    providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }],
    declarations: [
        LandingComponent,
        ProductsListComponent
    ]
})
export class PagesModule { }

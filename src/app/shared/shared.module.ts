import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { ButtonLoaderComponent } from './button-loader/button-loader.component';
import { FormErrorWrapperComponent } from './form-error-wrapper/form-error-wrapper.component';
import { MissedErrorComponent } from './missed-error/missed-error.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        FormErrorWrapperComponent,
        ButtonLoaderComponent,
        MissedErrorComponent
    ],
    exports: [
        FormErrorWrapperComponent,
        ButtonLoaderComponent,
        MissedErrorComponent
    ],
    providers: []
})
export class SharedModule { }

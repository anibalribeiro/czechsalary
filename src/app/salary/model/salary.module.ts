import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Angulartics2Module } from 'angulartics2';

import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { SalaryFormComponent } from '@app/salary/salary-form/salary-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SalaryDetailsComponent } from '@app/salary/salary-details/salary-details.component';

@NgModule({
  declarations: [SalaryFormComponent, SalaryDetailsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    Angulartics2Module,
    ReactiveFormsModule,
  ],
  exports: [SalaryFormComponent],
})
export class SalaryModule {}

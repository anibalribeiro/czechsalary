import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { FreelancerComponent } from './freelancer.component';
import { FreelancerRoutingModule } from '@app/freelancer/freelancer-routing.module';

@NgModule({
  imports: [CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, FreelancerRoutingModule],
  declarations: [FreelancerComponent],
})
export class FreelancerModule {}

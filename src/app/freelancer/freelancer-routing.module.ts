import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FreelancerComponent } from './freelancer.component';
import { Shell } from '@app/shell/shell.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

const routes: Routes = [
  Shell.childRoutes([{ path: 'freelancer', component: FreelancerComponent, data: { title: marker('Freelancer') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class FreelancerRoutingModule {}

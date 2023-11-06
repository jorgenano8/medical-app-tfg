import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearPublicacionPage } from './crearpublicacion.page';

const routes: Routes = [
  {
    path: '',
    component: CrearPublicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearPublicacionPageRoutingModule {}

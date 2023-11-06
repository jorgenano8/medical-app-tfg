import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevacontrasenyaPageRoutingModule } from './nuevacontrasenya-routing.module';

import { NuevacontrasenyaPage } from './nuevacontrasenya.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NuevacontrasenyaPageRoutingModule
  ],
  declarations: [NuevacontrasenyaPage]
})
export class NuevacontrasenyaPageModule {}

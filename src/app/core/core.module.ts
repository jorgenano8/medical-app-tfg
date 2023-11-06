import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './servicios/auth.service';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [CommonModule, IonicModule],
  providers: [AuthService],
})
export class CoreModule {}

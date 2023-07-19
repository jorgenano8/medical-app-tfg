import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/servicios/auth.service';

@Component({
  selector: 'app-nuevacontrasenya',
  templateUrl: './nuevacontrasenya.page.html',
  styleUrls: ['./nuevacontrasenya.page.scss'],
})
export class NuevacontrasenyaPage implements OnInit {

  public formGroup: FormGroup;
  public loading: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController){
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
  });
  }

  ngOnInit() {
    this.loading=false;
  }

  ionViewWillLeave(){
    this.formGroup.reset();
  }

  onSubmit(){

    if (!this.formGroup.valid) { return; }

    this.loading = true;

    const email = this.formGroup.value;

    return this.authService.nuevacontrasenya(email).then(()=>{
      console.log('enviada')
      this.loading=false;
      this.alertaEmailEnviado();
    }).catch(()=>{
      this.loading=false;
      this.alertaEmailNoEnviado();
    });
  }

  async alertaEmailEnviado() {
    const alert = await this.alertController.create({
      header: '¡Correo electrónico enviado!',
      message: 'Revisa tu bandeja de entrada para restablecer tu contraseña. Revisa también tu bandeja de spam.',
      buttons: ['OK']
    });

    alert.present();
  }

  async alertaEmailNoEnviado() {
    const alert = await this.alertController.create({
      header: '¡Ups!',
      message: 'Parece que ha habido un error al enviar el correo electrónico. Revisa tu correo e inténtalo de nuevo más tarde.',
      buttons: ['OK']
    });

    alert.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formGroup: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController){
      this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.formGroup.valid) { return; }

    const { email, contraseña } = this.formGroup.value;

    this.authService.login(email, contraseña).then(() => {
      this.router.navigate(['/home']);
    }).catch((error)=>{
      this.alertaInicioSesionIncorrecto();
    });
  }

  async alertaInicioSesionIncorrecto() {
    const alert = await this.alertController.create({
      header: 'Inicio de sesión fallido',
      message: 'Parece que algo ha fallado. Revise sus credenciales y vuelva a intentarlo.',
      buttons: ['OK']
    });

    alert.present();
  }
}

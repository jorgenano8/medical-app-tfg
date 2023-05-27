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

  public formGroup: FormGroup;
  public loading: Boolean = false;

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

    this.loading = true;

    const { email, contraseña } = this.formGroup.value;

    this.authService.login(email, contraseña).then(() => {
      this.router.navigateByUrl('/home');
      this.loading = false;
    }).catch((error)=>{
      this.loading = false;
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

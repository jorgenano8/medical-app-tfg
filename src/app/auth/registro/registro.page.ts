import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/servicios/auth.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formGroup: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router,
              private alertController: AlertController){
    this.formGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    contraseña: ['', [Validators.required]],
    });

    const alert = this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'This is an alert!',
      buttons: ['OK'],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const { email, contraseña } = this.formGroup.value;

      this.authService.registro(email, contraseña).then(()=>
      this.usuarioService.createUsuario(
        {email: email,
        contraseña: contraseña,
        fechaRegistro: new Date().toLocaleDateString(),
        nombre: email,
        tipo: 'normal'
        })).then(()=>
        this.lanzarAlertaRegistro().then(()=>
        this.router.navigate(['/login']))
      );
    }
  }

  async lanzarAlertaRegistro() {
    const alert = await this.alertController.create({
      header: 'Registro correcto',
      message: 'Se ha registrado correctamente. Ahora ya puede iniciar sesión con sus datos.',
      buttons: ['OK']
    });

    await alert.present();
  }

}

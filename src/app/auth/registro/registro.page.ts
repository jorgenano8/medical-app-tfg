import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/servicios/auth.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/core/modelos/usuario.model';

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
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      colegiado: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required],],
      contraseña2: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  onSubmit() {

    const infoUsuario : Usuario = {};

    if (!this.formGroup.valid) { return; }

    const { nombre, apellidos, colegiado, dni, email, contraseña } = this.formGroup.value;

    infoUsuario.nombre = nombre;
    infoUsuario.apellidos = apellidos;
    infoUsuario.colegiado = colegiado;
    infoUsuario.dni = dni;
    infoUsuario.email = email;
    infoUsuario.fechaRegistro = new Date().toLocaleString();
    infoUsuario.email = email;

    this.authService.registro(email, contraseña).then((userCredential)=>{
      const uid = userCredential.user?.uid;

      this.usuarioService.newUsuario(uid, infoUsuario).then(()=>{
        this.authService.logout().then(()=>{
          this.router.navigateByUrl('/login').then(()=>{
            this.alertaRegistroCorrecto();
        })
      })
    })
    }).catch((error)=>{
      this.alertaRegistroIncorrecto();
    });
  }

  async alertaRegistroCorrecto() {
    const alert = await this.alertController.create({
      header: 'Registro correcto',
      message: 'Se ha registrado correctamente. Ahora ya puede iniciar sesión con sus credenciales.',
      buttons: ['OK']
    });

    alert.present();
  }

  async alertaRegistroIncorrecto() {
    const alert = await this.alertController.create({
      header: 'Registro incorrecto',
      message: 'Parece que algo ha fallado. Revise sus credenciales y vuelva a intentarlo.',
      buttons: ['OK']
    });

    alert.present();
  }

}

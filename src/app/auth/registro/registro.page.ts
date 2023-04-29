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

    //TODO: confirmar contraseñas, codificar contraseña
    //¿es necesario guardarme la contraseña?

    const { nombre, apellidos, colegiado, dni, email, contraseña } = this.formGroup.value;

    this.authService.registro(email, contraseña).then((userCredential)=>{
      const uid = userCredential.user?.uid;

      const infoUsuario={
        nombre: nombre,
        uid: uid,
        apellidos: apellidos,
        colegiado: colegiado,
        dni: dni,
        email: email,
        contraseña: contraseña,
        fechaRegistro: new Date().toLocaleDateString(),
        tipo: 'normal'
      };

      this.usuarioService.crearUsuario(uid, infoUsuario);

    }).then(()=>{
      this.router.navigateByUrl('/login');
    }).catch((error)=>{
      console.log(error);
    });
  }

  async alertaRegistroCorrecto() {
    const alert = await this.alertController.create({
      header: 'Registro correcto',
      message: 'Se ha registrado correctamente. Ahora ya puede iniciar sesión con sus datos.',
      buttons: ['OK']
    });

    alert.present();
  }

}

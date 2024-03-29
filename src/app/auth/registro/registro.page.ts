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

  public formGroup: FormGroup;
  public loading: Boolean = false;
  public listaEspecialidades: string[] = ["Médico", "Farmacéutico", "Dentista", "Veterinario", "Psicólogo", "Enfermero",
  "Fisioterapeuta", "Podólogo", "Óptico-Optometrista", "Logopeda", "Terapeuta ocupacional"]

  public dniRegex = '^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$';
  public publicRegex = '^[0-9]{9}$';

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router,
              private alertController: AlertController){
    this.formGroup = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      colegiado: ['', [Validators.required, Validators.pattern(this.publicRegex)]],
      dni: ['', [Validators.required, Validators.pattern(this.dniRegex)]],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required],],
      contraseña2: ['', [Validators.required]],
      terminos: [false, Validators.requiredTrue]
    }, {validator: this.compararContraseñas}
  )};

  ngOnInit() {
  }

  ionViewWillLeave(){
    this.formGroup.reset();
  }

  compararContraseñas(formGroup: FormGroup) {
    if (formGroup.get('contraseña')?.value === formGroup.get('contraseña2')?.value) {
      formGroup.get('contraseña2')?.setErrors(null);
    } else {
      formGroup.get('contraseña2')?.setErrors({ 'diferentes': true });
    }
  }

  onSubmit() {

    if (!this.formGroup.valid || !this.terminosAceptados()) { return; }

    this.loading = true;

    const { nombre, apellidos, colegiado, dni, email, contraseña } = this.formGroup.value;

    this.authService.registro(email, contraseña).then((userCredential)=>{
      const uid = userCredential.user?.uid;
      const infoUsuario : Usuario = {
        uid : uid,
        nombre : nombre,
        apellidos : apellidos,
        colegiado : colegiado,
        dni : dni,
        email : email,
        fechaRegistro : new Date().toLocaleString(),
        tipo : "normal",
        especialidad: this.listaEspecialidades[Math.floor(Math.random()*this.listaEspecialidades.length)]
      };

      this.usuarioService.newUsuario(uid, infoUsuario).then(()=>{
        this.authService.logout().then(()=>{
          this.router.navigateByUrl('/login').then(()=>{
            this.loading = false;
            this.alertaRegistroCorrecto();
          })
        })
      })
    }).catch((error)=>{
      this.loading = false;
      this.alertaRegistroIncorrecto();
    });
  }

  terminosAceptados(): boolean{
    return this.formGroup.value.terminos;
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
      header: '¡Ups!',
      message: 'Parece que algo ha fallado. Vuelva a intentarlo más tarde.',
      buttons: ['OK']
    });

    alert.present();
  }

}

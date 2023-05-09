import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
})
export class PublicacionPage implements OnInit {

  formGroup: FormGroup;
  public usuarioModel: Usuario = {};

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private router: Router,
    private alertController: AlertController) {
      this.formGroup = this.formBuilder.group({
        titulo: ['', [Validators.required, Validators.maxLength(70)]],
        contenido: ['', [Validators.required]]
      });
     }

  ngOnInit() {
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }
      this.usuarioService.getUsuario(currentUser?.uid).subscribe((infoUsuario) => {
        this.rellenarDatosUsuario(infoUsuario.data());
      })
    }).catch((error)=>{
      console.log(error.message);
    });
  }

  onSubmit(){
    if (!this.formGroup.valid) { return; }

    const { titulo, contenido} = this.formGroup.value;

    const infoPublicacion:Publicacion={
      titulo:titulo,
      contenido:contenido,
      fechaPublicacion: new Date(),
      etiqueta:'test',
    }

    this.publicacionService.newPublicacionVacia().then((docRef) => {
      infoPublicacion.uid=docRef.ref.id;
      infoPublicacion.usuario=this.usuarioModel.uid;
      docRef.set(infoPublicacion);
    }).then(()=>{
      this.router.navigateByUrl('/home/inicio');
    }).catch(()=>{
      this.alertaPublicaciónIncorrecto();
    })
  }

  async alertaPublicaciónIncorrecto() {
    const alert = await this.alertController.create({
      header: '¡Ups!',
      message: 'Parece que algo ha fallado. Vuelva a intentarlo más tarde.',
      buttons: ['OK']
    });

    alert.present();
  }

  rellenarDatosUsuario(infoUsuario: any){
    this.usuarioModel.nombre = infoUsuario.nombre;
    this.usuarioModel.apellidos = infoUsuario.apellidos;
    this.usuarioModel.uid = infoUsuario.uid;
  }
}

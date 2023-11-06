import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Etiqueta } from 'src/app/core/modelos/etiqueta.model';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { EtiquetaService } from 'src/app/core/servicios/etiqueta.service';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';
import { Location } from '@angular/common';
import { NotificacionService } from 'src/app/core/servicios/notificacion.service';


@Component({
  selector: 'app-crearpublicacion',
  templateUrl: './crearpublicacion.page.html',
  styleUrls: ['./crearpublicacion.page.scss'],
})
export class CrearPublicacionPage implements OnInit {

  public formGroup: FormGroup;
  public usuarioModel: Usuario = {};
  public listaEtiquetas: any= [];
  public loading: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private etiquetaService: EtiquetaService,
    private notificacionService: NotificacionService,
    private router: Router,
    private location: Location,
    private alertController: AlertController) {
      this.formGroup = this.formBuilder.group({
        titulo: ['', [Validators.required, Validators.maxLength(70)]],
        contenido: ['', [Validators.required]],
        etiqueta: ['', [Validators.required]]
      });
     }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.formGroup.reset();
    this.prepararDatosUsuario();
    this.cargarEtiquetas();
  }

  ionViewWillLeave(){
    this.formGroup.reset();
  }

  cancelButton(){
    this.location.back();
  }

  publicarPublicacion(){
    if (!this.formGroup.valid) { return; }

    this.loading = true;

    const { titulo, contenido, etiqueta} = this.formGroup.value;

    const infoPublicacion:Publicacion={
      uid: "",
      usuario:"",
      titulo:titulo,
      contenido:contenido.replace(/\n/g, '<br>'),
      fechaPublicacion: new Date().toLocaleString(),
      dateSystem: new Date(),
      etiqueta: etiqueta,
      nombre: "",
      apellidos: "",
      especialidad: ""
    }

    this.publicacionService.newPublicacionVacia().then((docRef) => {
      infoPublicacion.uid=docRef.ref.id;
      infoPublicacion.usuario=this.usuarioModel.uid;
      infoPublicacion.nombre=this.usuarioModel.nombre;
      infoPublicacion.apellidos=this.usuarioModel.apellidos;
      infoPublicacion.especialidad=this.usuarioModel.especialidad;
      docRef.set(infoPublicacion);
    }).then(()=>{
      this.loading = false;
    }).then(()=>{
      if(this.usuarioModel.seguidores){
        this.usuarioModel.seguidores.forEach(seguidor=>{
          this.notificacionService.newNotificacionPublicacion(this.usuarioModel, seguidor)
        })
      }
    }).then(()=>{
      this.router.navigateByUrl('/home/inicio');
    }).catch(()=>{
      this.loading = false;
      this.alertaPublicaciónIncorrecto();
    })
  }

  prepararDatosUsuario(){
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }
      this.usuarioService.getUsuario(currentUser?.uid).subscribe((infoUsuario) => {
        this.rellenarDatosUsuario(infoUsuario.data());
      })
    }).catch((error)=>{
      console.log(error.message);
    });
  }

  rellenarDatosUsuario(infoUsuario: any){
    this.usuarioModel.nombre = infoUsuario.nombre;
    this.usuarioModel.apellidos = infoUsuario.apellidos;
    this.usuarioModel.uid = infoUsuario.uid;
    this.usuarioModel.especialidad = infoUsuario.especialidad;
    this.usuarioModel.seguidores = infoUsuario.seguidores;
  }

  cargarEtiquetas(){
    this.listaEtiquetas=[];
    this.etiquetaService.getEtiquetas().ref.get().then((resEtiqueta)=>{
      resEtiqueta.forEach(infoEtiqueta=>{
        this.listaEtiquetas.push(infoEtiqueta.data().nombre);
      })
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



}

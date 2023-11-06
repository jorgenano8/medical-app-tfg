import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comentario } from 'src/app/core/modelos/comentario.model';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
})
export class PublicacionPage implements OnInit {

  public publicacionModel: Publicacion={};
  public usuarioModel: Usuario={};
  public listaComentarios: Comentario[]=[];

  public loaded = false;
  public mostrarComentarios = true;
  public creadorPublicacion = false;
  public usuarioAdmin = false;
  public usuarioMod = false;
  public userUIDlogged: any;
  public userNombreLogged: any;
  public userApellidosLogged: any;
  public uidPublicacion: any;

  public formGroup: FormGroup

  constructor(
    private route: ActivatedRoute,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private location: Location,
    private afAuth: AngularFireAuth,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    ) {
    this.uidPublicacion=this.route.snapshot.params['uid'];
      this.formGroup = this.formBuilder.group({
        contenido: ['', [Validators.required]]
      });
     }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.resetPagina();
    this.cargarPublicacion();
  }

  resetPagina(){
    this.loaded=false;
    this.mostrarComentarios=true;
    this.creadorPublicacion=false;
    this.usuarioAdmin=false;
    this.usuarioMod=false;
    this.listaComentarios=[];
  }

  backButton(){
    this.location.back();
  }

  cargarPublicacion(){
    this.publicacionService.getPublicacion(this.uidPublicacion).subscribe((infoPublicacion) => {
      this.rellenarDatosPublicacion(infoPublicacion.data());
      this.cargarUsuario(this.publicacionModel.usuario);
      this.comprobarCreadorPublicacion(this.publicacionModel.usuario);
    });
  }

  rellenarDatosPublicacion(infoPublicacion: any){
    this.publicacionModel.uid = infoPublicacion.uid;
    this.publicacionModel.usuario = infoPublicacion.usuario;
    this.publicacionModel.fechaPublicacion = infoPublicacion.fechaPublicacion;
    this.publicacionModel.etiqueta = infoPublicacion.etiqueta;
    this.publicacionModel.titulo = infoPublicacion.titulo;
    this.publicacionModel.contenido = infoPublicacion.contenido;

    if(infoPublicacion.comentarios){
      infoPublicacion.comentarios.forEach((comentario:Comentario)=>{
        this.listaComentarios.push(comentario);
      })
      this.listaComentarios.reverse();
    }

  }

  cargarUsuario(uidUsuario: any){
    this.usuarioService.getUsuario(uidUsuario).subscribe((infoUsuario) => {
      this.rellenarDatosUsuario(infoUsuario.data());
    })
  }

  rellenarDatosUsuario(infoUsuario: any){
    this.usuarioModel.uid = infoUsuario.uid;
    this.usuarioModel.nombre = infoUsuario.nombre;
    this.usuarioModel.apellidos = infoUsuario.apellidos;
    this.usuarioModel.especialidad = infoUsuario.especialidad;
    this.loaded=true;

  }

  comprobarCreadorPublicacion(uidUsuarioPublicacion: any){
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }
      this.userUIDlogged=currentUser?.uid;
      this.usuarioService.getUsuario(this.userUIDlogged).subscribe((infoUsuario) => {
        this.userNombreLogged=infoUsuario.data()?.nombre;
        this.userApellidosLogged=infoUsuario.data()?.apellidos;

        if(infoUsuario.data()?.uid===uidUsuarioPublicacion){
          this.creadorPublicacion=true;
        }

        if(infoUsuario.data()?.tipo==='ADMIN'){
          this.usuarioAdmin=true;
        }

        if(infoUsuario.data()?.tipo==='MOD'){
          this.usuarioMod=true;
        }

      })
    })
  }



  eliminarPublicacion(){
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }
      this.userUIDlogged=currentUser?.uid;
      this.usuarioService.getUsuario(this.userUIDlogged).subscribe((infoUsuario) => {

        if(infoUsuario.data()?.uid===this.publicacionModel.usuario || infoUsuario.data()?.tipo==='ADMIN' || infoUsuario.data()?.tipo==='MOD'){
          this.publicacionService.deletePublicacion(this.publicacionModel.uid);
        }

      })
    }).then(()=>{
      this.alertaOKEliminarPublicacion();
      this.location.back();
    }).catch(()=>{
      this.alertaErrorEliminarPublicacion();
    })
  }

  async alertaOKEliminarPublicacion() {
    const alert = await this.alertController.create({
      header: 'Publicación eliminada',
      message: 'La publicación ha podido ser eliminada.',
      buttons: ['OK']
    });

    alert.present();
  }

  async alertaErrorEliminarPublicacion() {
    const alert = await this.alertController.create({
      header: '¡Ups',
      message: 'Parece que algo ha fallado. Vuelva a intentarlo más tarde.',
      buttons: ['OK']
    });

    alert.present();
  }

  enviarComentario(){
    this.mostrarComentarios=false;

    if (!this.formGroup.valid) { return; }

    const { contenido } = this.formGroup.value;

    const comentario: Comentario={
      contenido: contenido,
      usuario: this.userUIDlogged,
      nombre:this.userNombreLogged,
      apellidos:this.userApellidosLogged,
      fecha: new Date().toLocaleString(),
      dateSystem: new Date(),

    }

    this.publicacionService.newComentarioToPublicacion(this.uidPublicacion, comentario).then(()=>{
      this.formGroup.reset();
      this.cargarComentariosAfterComentar();
    })
  }

  cargarComentariosAfterComentar(){
    this.publicacionService.getPublicacion(this.uidPublicacion).subscribe((infoPublicacion: any) => {
      if(infoPublicacion.data().comentarios){
        this.listaComentarios=[];
        infoPublicacion.data().comentarios.forEach((comentario:Comentario)=>{
          this.listaComentarios.push(comentario);
        })
        this.listaComentarios.reverse();
      }
    });
    this.mostrarComentarios=true;
  }

}

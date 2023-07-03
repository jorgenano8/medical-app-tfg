import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
})
export class PublicacionPage implements OnInit {

  public publicacionModel: Publicacion={};
  public usuarioModel: Usuario={};

  public loaded = false;
  public creadorPublicacion = false;
  public usuarioAdmin = false;
  public usuarioMod = false;

  constructor(
    private route: ActivatedRoute,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private location: Location,
    private afAuth: AngularFireAuth
    ) { }

  ngOnInit() {
    this.resetPagina();
    this.cargarPublicacion(this.route.snapshot.params['uid']);
  }

  ionViewWillEnter(){
  }

  resetPagina(){
    this.loaded=false;
    this.creadorPublicacion=false;
    this.usuarioAdmin=false;
    this.usuarioMod=false;
  }

  backButton(){
    this.location.back();
  }

  cargarPublicacion(uidPublicacion: String){
    this.publicacionService.getPublicacion(uidPublicacion).subscribe((infoPublicacion) => {
      this.rellenarDatosPublicacion(infoPublicacion.data());
      this.cargarUsuario(this.publicacionModel.usuario);
      this.comprobarCreadorPublicacion(this.publicacionModel.usuario);
    });
  }

  rellenarDatosPublicacion(infoPublicacion: any){
    this.publicacionModel.usuario = infoPublicacion.usuario;
    this.publicacionModel.fechaPublicacion = infoPublicacion.fechaPublicacion;
    this.publicacionModel.etiqueta = infoPublicacion.etiqueta;
    this.publicacionModel.titulo = infoPublicacion.titulo;
    this.publicacionModel.contenido = infoPublicacion.contenido;
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
      this.usuarioService.getUsuario(currentUser?.uid).subscribe((infoUsuario) => {

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

}

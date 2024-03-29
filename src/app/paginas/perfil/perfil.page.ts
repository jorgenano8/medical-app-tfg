import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { AuthService } from 'src/app/core/servicios/auth.service';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  public usuarioModel: Usuario = {};
  public listaPublicaciones: Publicacion[]=[];
  public loaded :  Boolean = false;
  public existenPublicaciones :  Boolean = false;

  public terminoBusqueda: string = '';
  public listaBusquedaUsuarios: Usuario[]=[];

  constructor(
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.resetPagina()
    this.cargarDatosUsuario();
  }

  ionViewWillLeave(){
    this.resetPagina();
  }

  resetPagina(){
    this.listaBusquedaUsuarios=[];
    this.terminoBusqueda='';
    this.loaded=false;
    this.existenPublicaciones=false;
  }

  cargarDatosUsuario(){
    this.loaded = false;
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }
      this.usuarioService.getUsuario(currentUser?.uid).subscribe((infoUsuario) => {
        this.rellenarDatosUsuario(infoUsuario.data());
        this.cargarPublicacionesUsuario(currentUser.uid);
      })
    }).catch((error)=>{
      console.log(error.message);
    });
  }

  cargarPublicacionesUsuario(idUsuario: any){
    this.listaPublicaciones=[];
    this.publicacionService.getPublicaciones().ref.where('usuario', '==', idUsuario).orderBy('dateSystem', 'desc').get().then((resPublicacion)=>{
      resPublicacion.forEach(infoPublicacion =>{
        this.existenPublicaciones=true;
        this.rellenarDatosPublicacion(infoPublicacion);
      })
    }).then(()=>{
      this.loaded=true;
    }).catch((error)=>{
      console.log(error.message);
    });
  }

  rellenarDatosPublicacion(infoPublicacion: any){
    this.listaPublicaciones.push({
      uid:infoPublicacion.data().uid,
      usuario:infoPublicacion.data().usuario,
      nombre:infoPublicacion.data().nombre,
      apellidos:infoPublicacion.data().apellidos,
      especialidad:infoPublicacion.data().especialidad,
      fechaPublicacion: infoPublicacion.data().fechaPublicacion,
      etiqueta: infoPublicacion.data().etiqueta,
      titulo: infoPublicacion.data().titulo,
      contenido: infoPublicacion.data().contenido
    });
  }

  rellenarDatosUsuario(infoUsuario: any){
    this.usuarioModel.nombre = infoUsuario.nombre;
    this.usuarioModel.apellidos = infoUsuario.apellidos;
    this.usuarioModel.colegiado = infoUsuario.colegiado;
    this.usuarioModel.especialidad = infoUsuario.especialidad;
    this.usuarioModel.descripcion = infoUsuario.descripcion;
  }

  buscarUsuarios() {
    this.listaBusquedaUsuarios=[];
    this.usuarioService.getUsuarios().ref.where('nombre', '==', this.terminoBusqueda).get().then((listaUsuariosBusqueda)=>{
      listaUsuariosBusqueda.forEach(usuario=>{
        this.listaBusquedaUsuarios.push(usuario.data());
      })
    }).catch((error)=>{
      console.log(error.message);
    })
  }

  logout(){
    this.authService.logout().then(()=>{
      this.router.navigateByUrl('/login');
    }).catch((error)=>{
      console.log(error.message);
    });
  }

}

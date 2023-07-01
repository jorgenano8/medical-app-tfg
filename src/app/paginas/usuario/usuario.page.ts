import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  private userUIDlogged: any;
  public loaded: Boolean= false;
  public usuarioModel: Usuario = {};
  public listaPublicaciones: Publicacion[]=[];

  public terminoBusqueda: string = '';
  public listaBusquedaUsuarios: Usuario[]=[];

  public mostrarBotones: boolean = true;
  public siguiendo: boolean = false;
  public seguidor: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.listaBusquedaUsuarios=[];
    this.terminoBusqueda='';
    this.loaded=false;
    this.comprobarUsuario(this.route.snapshot.params['uid']);
  }

  comprobarUsuario(uidUsuarioPagina:String){
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }
      this.userUIDlogged=currentUser.uid;
      if(uidUsuarioPagina===currentUser.uid){
        this.router.navigateByUrl('home/perfil');
        return;
      }
    }).then(()=>{
        this.cargarDatosUsuario(this.route.snapshot.params['uid']);
    }).catch((error)=>{
      console.log(error.message);
    });
  }

  cargarDatosUsuario(uidUsuario: String){
    this.usuarioService.getUsuario(uidUsuario).subscribe((infoUsuario)=>{
      this.rellenarDatosUsuario(infoUsuario.data());

      if(infoUsuario.data()?.seguidores?.includes(this.userUIDlogged)){
        this.siguiendo=true;
      }

      if(infoUsuario.data()?.seguidos?.includes(this.userUIDlogged)){
        this.seguidor=true;
      }

      this.cargarPublicacionesUsuario(uidUsuario);
    })
  }

  cargarPublicacionesUsuario(idUsuario: any){
    this.listaPublicaciones=[];
    this.publicacionService.getPublicaciones().ref.where('usuario', '==', idUsuario).orderBy('fechaPublicacion', 'desc').get().then((resPublicacion)=>{
      resPublicacion.forEach(infoPublicacion =>{
        this.rellenarDatosPublicacion(infoPublicacion);
      })
    })
  }

  rellenarDatosPublicacion(infoPublicacion: any){
    this.listaPublicaciones.push({
      uid:infoPublicacion.data().uid,
      usuario:infoPublicacion.data().usuario,
      fechaPublicacion: infoPublicacion.data().fechaPublicacion,
      etiqueta: infoPublicacion.data().etiqueta,
      titulo: infoPublicacion.data().titulo,
      contenido: infoPublicacion.data().contenido
    });
    this.loaded=true;
  }

  rellenarDatosUsuario(infoUsuario: any){
    this.usuarioModel.nombre = infoUsuario.nombre;
    this.usuarioModel.apellidos = infoUsuario.apellidos;
    this.usuarioModel.colegiado = infoUsuario.colegiado;
    this.usuarioModel.descripcion = infoUsuario.descripcion;
    this.usuarioModel.especialidad = infoUsuario.especialidad;
  }

  seguirUsuario(){
    this.mostrarBotones=false;
    this.usuarioService.updateUsuarioSeguir(this.userUIDlogged, this.route.snapshot.params['uid']).then(()=>{
      this.usuarioService.updateUsuarioNuevoSeguidor(this.userUIDlogged, this.route.snapshot.params['uid']);
      this.siguiendo=true;
    })
    this.mostrarBotones=true;
  }

  dejarSeguirUsuario(){
    this.mostrarBotones=false;
    this.usuarioService.updateUsuarioDejarSeguir(this.userUIDlogged, this.route.snapshot.params['uid']).then(()=>{
      this.usuarioService.updateUsuarioEliminarSeguidor(this.userUIDlogged, this.route.snapshot.params['uid']);
      this.siguiendo=false;
    })
    this.mostrarBotones=true;
  }

  buscarUsuarios() {
    this.listaBusquedaUsuarios=[];
    this.usuarioService.getUsuarios().ref.where('nombre', '==', this.terminoBusqueda).get().then((listaUsuariosBusqueda)=>{
      listaUsuariosBusqueda.forEach(usuario=>{
        this.listaBusquedaUsuarios.push(usuario.data());
      })
      console.log(this.listaBusquedaUsuarios)

    }).catch((error)=>{
      console.log(error.message);
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';
import { register } from 'swiper/element/bundle';
import { Location } from '@angular/common';
import { Chat } from 'src/app/core/modelos/chat.model';
import { ChatService } from 'src/app/core/servicios/chat.service';
register();

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  private userUIDlogged: any;
  public loaded: Boolean= false;
  public existenPublicaciones: Boolean= false;
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
    private location: Location,
    private chatService: ChatService
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.resetPagina();
    this.comprobarUsuario(this.route.snapshot.params['uid']);
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

  backButton(){
    this.location.back();
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
    this.usuarioModel.descripcion = infoUsuario.descripcion;
    this.usuarioModel.especialidad = infoUsuario.especialidad;
    this.usuarioModel.seguidos = infoUsuario.seguidos;
  }

  seguirUsuario(){
    this.mostrarBotones=false;
    this.usuarioService.updateUsuarioSeguir(this.userUIDlogged, this.route.snapshot.params['uid']).then(()=>{
      this.usuarioService.updateUsuarioNuevoSeguidor(this.userUIDlogged, this.route.snapshot.params['uid']);
      this.siguiendo=true;
    }).then(()=>{
      if(this.usuarioModel.seguidos?.includes(this.userUIDlogged)){
        this.crearChat();
      }
    }).catch((error)=>{
      console.log(error.message);
    });
    this.mostrarBotones=true;
  }

  dejarSeguirUsuario(){
    this.mostrarBotones=false;
    this.usuarioService.updateUsuarioDejarSeguir(this.userUIDlogged, this.route.snapshot.params['uid']).then(()=>{
      this.usuarioService.updateUsuarioEliminarSeguidor(this.userUIDlogged, this.route.snapshot.params['uid']);
      this.siguiendo=false;
    }).catch((error)=>{
      console.log(error.message);
    });
    this.mostrarBotones=true;
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

  crearChat(){
    let chatExiste=false;

    this.chatService.getChats().ref.where("usuario1", "==", this.userUIDlogged).get().then((listaChats)=>{
      listaChats.forEach(chat=>{
        if(chat.data().usuario2===this.route.snapshot.params['uid']){
          chatExiste=true;
        }
      })
    }).then(()=>{
      this.chatService.getChats().ref.where("usuario2", "==", this.userUIDlogged).get().then((listaChats)=>{
        listaChats.forEach(chat=>{
          if(chat.data().usuario1===this.route.snapshot.params['uid']){
            chatExiste=true;
          }
        })
      })
    }).then(()=>{
      if(!chatExiste){

        const infoNuevoChat:Chat={
          usuario1: this.userUIDlogged,
          usuario2: this.route.snapshot.params['uid']
        };

        this.chatService.newChatVacio().then((refDoc)=>{
          infoNuevoChat.uid=refDoc.id;
          refDoc.set(infoNuevoChat);
        })
      }
    }).catch((error)=>{
      console.log(error.message);
    })
  }

}

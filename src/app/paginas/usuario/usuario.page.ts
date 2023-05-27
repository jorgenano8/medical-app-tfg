import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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

  private miPerfil: Boolean=false;
  public loaded: Boolean= false;
  public usuarioModel: Usuario = {};
  public listaPublicaciones: Publicacion[]=[];

  constructor(
    private route: ActivatedRoute,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth,
    private router: Router
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.loaded=false;
    this.miPerfil=false;
    this.comprobarUsuario(this.route.snapshot.params['uid']);
  }

  comprobarUsuario(uidUsuarioPagina:String){
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }
      if(uidUsuarioPagina===currentUser.uid){
        this.miPerfil=true;
      }
    }).then(()=>{
      if(!this.miPerfil){
        this.cargarDatosUsuario(this.route.snapshot.params['uid']);
      }else{
        this.router.navigateByUrl('home/perfil');
      }
    }).catch((error)=>{
      console.log(error.message);
    });
  }

  cargarDatosUsuario(uidUsuario: String){
    this.usuarioService.getUsuario(uidUsuario).subscribe((infoUsuario)=>{
      this.rellenarDatosUsuario(infoUsuario.data());
      this.cargarPublicacionesUsuario(this.usuarioModel.uid);
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
    this.usuarioModel.uid = infoUsuario.uid;
    this.usuarioModel.email = infoUsuario.email;
    this.usuarioModel.colegiado = infoUsuario.colegiado;
    this.usuarioModel.dni = infoUsuario.dni;
    this.usuarioModel.fechaRegistro = infoUsuario.fechaRegistro;
    this.usuarioModel.descripcion = infoUsuario.descripcion;
  }

}

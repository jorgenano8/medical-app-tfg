import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { Usuario } from 'src/app/core/modelos/usuario.model';
import { AuthService } from 'src/app/core/servicios/auth.service';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';
import { UsuarioService } from 'src/app/core/servicios/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public listaPublicaciones: Publicacion[]=[];
  public uidUsuarios: any[] = [];
  public loaded :  Boolean = false;
  public existenPublicaciones: Boolean = false;

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
    this.resetPagina();
    this.cargarPublicaciones();
  }

  ionViewWillLeave(){
    this.resetPagina();
  }

  resetPagina(){
    this.uidUsuarios=[];
    this.listaPublicaciones=[];
    this.listaBusquedaUsuarios=[];
    this.terminoBusqueda='';
    this.loaded = false;
    this.existenPublicaciones = false;
  }

  cargarPublicaciones(){
    this.afAuth.onAuthStateChanged((currentUser)=>{
      if(!currentUser){ return; }

      this.usuarioService.getUsuario(currentUser?.uid).subscribe((infoUsuario) => {
        this.uidUsuarios.push(currentUser.uid);
        infoUsuario.data()?.seguidos?.forEach(seguido=>{
        this.uidUsuarios.push(seguido);
        })

        this.publicacionService.getPublicaciones().ref.where('usuario', 'in', this.uidUsuarios).orderBy('dateSystem', 'desc').get().then((publicaciones)=>{
          this.existenPublicaciones=true;
          publicaciones.forEach(publicacion=>{
            this.listaPublicaciones.push(publicacion.data());
          })
        }).then(()=>{
          this.loaded=true;
        })
      })
    }).catch((error)=>{
      console.log(error.message);
    });
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
}

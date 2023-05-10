import { Component, OnInit } from '@angular/core';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public listaPublicaciones: Publicacion[]=[];

  constructor(private publicacionService: PublicacionService) { }

  ngOnInit() {
    this.publicacionService.getPublicaciones().valueChanges().subscribe((publicaciones)=>{
      this.listaPublicaciones=publicaciones.map((publicacion)=>{
        return new Publicacion(publicacion.uid, publicacion.usuario, publicacion.fechaPublicacion, publicacion.etiqueta, publicacion.titulo, publicacion.contenido);
      });
      console.log(this.listaPublicaciones);
      this.ordenarPublicaciones();
    });
  }

  ordenarPublicaciones(){
    this.listaPublicaciones.sort((a, b) => {
      const dateA = a.fechaPublicacion ? new Date(a.fechaPublicacion) : undefined;
      const dateB = b.fechaPublicacion ? new Date(b.fechaPublicacion) : undefined;
      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime();
      }
      return dateB ? 1 : -1;
    });
  }

}

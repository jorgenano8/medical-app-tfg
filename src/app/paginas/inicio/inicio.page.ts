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
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter");
  }

}

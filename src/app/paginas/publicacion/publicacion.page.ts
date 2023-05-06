import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Publicacion } from 'src/app/core/modelos/publicacion.model';
import { PublicacionService } from 'src/app/core/servicios/publicacion.service';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.page.html',
  styleUrls: ['./publicacion.page.scss'],
})
export class PublicacionPage implements OnInit {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private publicacionService: PublicacionService,
    private router: Router,
    private alertController: AlertController) {
      this.formGroup = this.formBuilder.group({
        titulo: ['', [Validators.required, Validators.maxLength(70)]],
        contenido: ['', [Validators.required]]
      });
     }

  ngOnInit() {
  }

  onSubmit(){
    if (!this.formGroup.valid) { return; }

    const { titulo, contenido} = this.formGroup.value;

    const infoPublicacion:Publicacion={
      titulo:titulo,
      contenido:contenido,
      fechaPublicacion: new Date(),
      etiqueta:'test',
    }

    this.publicacionService.newPublicacionVacia().then((docRef) => {
      infoPublicacion.uid=docRef.ref.id;;
      docRef.set(infoPublicacion);
    }).then(()=>{
      this.router.navigateByUrl('/home/inicio');
    }).catch(()=>{
      this.alertaPublicaciónIncorrecto();
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

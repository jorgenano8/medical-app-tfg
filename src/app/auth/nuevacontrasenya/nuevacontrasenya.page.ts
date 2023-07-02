import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevacontrasenya',
  templateUrl: './nuevacontrasenya.page.html',
  styleUrls: ['./nuevacontrasenya.page.scss'],
})
export class NuevacontrasenyaPage implements OnInit {

  public formGroup: FormGroup;
  public loading: Boolean = false;

  constructor(private formBuilder: FormBuilder,){
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
  });
  }

  ngOnInit() {
  }

  onSubmit(){

  }

}

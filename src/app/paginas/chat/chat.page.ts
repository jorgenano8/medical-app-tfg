import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public formGroup: FormGroup;
  public loaded:Boolean =false;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.formGroup = this.formBuilder.group({
      mensaje: ['', [Validators.required]]
    });
   }

  ngOnInit() {
    this.loaded=true;
  }

  enviarMensaje(){
    console.log('enviar')

  }

}

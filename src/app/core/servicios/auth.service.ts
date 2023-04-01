import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = this.afAuth.authState;

  constructor(private afAuth: AngularFireAuth) { }

  async login(email: string, contraseña: string){
    return await this.afAuth.signInWithEmailAndPassword(email, contraseña);
  }

  async registro(email: string, contraseña: string){
    return await this.afAuth.createUserWithEmailAndPassword(email, contraseña);
  }
}

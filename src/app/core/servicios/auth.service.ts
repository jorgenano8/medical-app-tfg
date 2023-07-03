import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User, getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  currentUser: firebase.default.User | null = null;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      if(user){
        this.currentUser = user;
      }else{
        this.currentUser = null;
      }
    });
  }

  async login(email: string, contraseña: string){
    return await this.afAuth.signInWithEmailAndPassword(email, contraseña);
  }

  async registro(email: string, contraseña: string){
    return await this.afAuth.createUserWithEmailAndPassword(email, contraseña);
  }

  async nuevacontrasenya(email: string){
    return await this.afAuth.sendPasswordResetEmail(email);
  }

  async logout(){
    return await this.afAuth.signOut();
  }
}

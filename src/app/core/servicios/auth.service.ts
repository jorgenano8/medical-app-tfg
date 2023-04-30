import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private currentUser: firebase.default.User | null = null;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user) => {
      if(user){
        this.currentUser = user;
        console.log(this.currentUser);
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

  async logout(){
    return await this.afAuth.signOut();
  }

}

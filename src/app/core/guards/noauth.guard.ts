import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class Noauthguard {

constructor(private router:Router,
            private afAuth: AngularFireAuth
            ){}

  canActivate() {
    return this.afAuth.authState.pipe(map(user => {
      if(user){
        this.router.navigateByUrl('/home');
      }
    }));
  }
}

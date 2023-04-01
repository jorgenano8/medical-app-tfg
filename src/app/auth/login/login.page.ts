import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/servicios/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formGroup: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router){
    this.formGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    contraseña: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const { email, contraseña } = this.formGroup.value;
      this.authService
        .login(email, contraseña).then((res) => {
            this.router.navigate(['/home']);
        })};
    }
}

import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit {

  formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '' , [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberme: [false]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) { }

  ngOnInit() {
    this.renderButton();
  }

  campoNoValido(campo: string) {
    if( this.loginForm.get(campo).invalid && this.formSubmitted ) {
        return true;
    }
     return false;
  }


  login(){
    
    this.formSubmitted = true;

    this.usuarioService.login( this.loginForm.value ).subscribe( resp => {
      if( this.loginForm.get('rememberme').value) {
        localStorage.setItem('email', this.loginForm.get('email').value);
      } else {
        localStorage.removeItem('email');
      }
      // Navegar al dashboard
      this.ngZone.run( () => {
        this.router.navigateByUrl('/');
      });

    }, (err) => {
      //console.warn(err.error.msg);
      Swal.fire({
        icon: 'error',
        title: 'No se ha podido iniciar sesión',
        text: err.error.msg,
      });
    });
    
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();
  }

  async startApp() {

    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          let id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token).subscribe( resp => {
            // Navegar al dashboard
            this.router.navigateByUrl('/');
          });

        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}

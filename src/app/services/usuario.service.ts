import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { tap, map, catchError, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '' ;
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return  {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  googleInit() {
    return new Promise( (resolve: any) => {
        gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '411848187968-alik8jom5qm57eog0vfmgomv1n9ub1vs.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });

  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        //console.log(resp);
        const { email, google, nombre,  role, uid, img = '' } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', google, role, img, uid );

        this.guardarStorage(resp.token, resp.menu);
        return true;
      }),
      catchError( error => of(false) )
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${ base_url }/usuarios`, formData)
                    .pipe(
                      tap( (resp: any) => {
                        this.guardarStorage(resp.token, resp.menu);
                      })
                    );
  }

  actualizarUsuario( data: { email: string, nombre: string, role: string } ){

    data = {
      ...data,
      role: this.usuario.role
    }

    // data.role = this.usuario.role;

    return this.http.put( `${ base_url }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

  login(formData: LoginForm) {
    return this.http.post(`${ base_url }/login`, formData)
                    .pipe(
                      tap( (resp: any) => {
                        this.guardarStorage(resp.token, resp.menu);
                      })
                    );
  }

  loginGoogle(token) {
    return this.http.post(`${ base_url }/login/google`, {token})
                    .pipe(
                      tap( (resp: any) => {
                        this.guardarStorage(resp.token, resp.menu);
                      })
                    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then( () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  cargarUsuarios(desde: number = 0) {
    return this.http.get<CargarUsuario>(`${base_url}/usuarios?desde=${ desde }`, this.headers)
                    .pipe(
                      map( resp => {
                        //console.log(resp.usuariosDB);
                        const usuariosDB = resp.usuariosDB.map(
                          user => new Usuario(user.nombre, user.email, '', user.google, user.role, user.img, user.uid)
                          );
                        return {
                          total: resp.total,
                          usuariosDB
                        };
                      })
                    );

  }

  eliminarUsuario(usuario: Usuario) {
    return this.http.delete(`${ base_url }/usuarios/${ usuario.uid }`, this.headers);
  }

  guardaUsuario( usuario: Usuario ){
    return this.http.put( `${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );
  }
}

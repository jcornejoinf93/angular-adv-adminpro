import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token')  || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private transformarUsuarios( data: any[] ): Usuario[] {
    return data.map(
      user => new Usuario(user.nombre, user.email, '', user.google, user.role, user.img, user.uid)
    );
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    return this.http.get<any[]>(`${ base_url }/todo/coleccion/${ tipo }/${ termino }`, this.headers)
          .pipe(
            map( (resp: any) => {
              //resp.data;
              switch (tipo) {
                case 'usuarios':
                  return this.transformarUsuarios( resp.data );
                default:
                  return [];
              }
             })
          );
  }
}

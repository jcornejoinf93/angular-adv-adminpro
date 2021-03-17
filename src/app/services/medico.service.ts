import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( private http: HttpClient ) { }

  get token() {
    return localStorage.getItem('token');
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  getMedicos() {
    return this.http.get( `${base_url}/medicos`, this.headers );
  }

  getMedicoPorId( medico: string ) {
    return this.http.get(`${base_url}/medicos/${medico}` , this.headers)
                .pipe(
                  map( (resp: {ok: boolean, medicoDB: Medico}) => resp.medicoDB )
                );
  }

  crearMedico(medico: Medico) {
    return this.http.post( `${base_url}/medicos`, medico, this.headers );
  }

  actualizarMedico(medico: Medico) {
    return this.http.put( `${base_url}/medicos/${medico._id}`, medico, this.headers );
  }

  eliminaMedico(id: string) {
    return this.http.delete( `${base_url}/medicos/${id}`, this.headers );
  }


}

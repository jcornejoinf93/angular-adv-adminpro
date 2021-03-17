import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  get token() {
    return localStorage.getItem('token');
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  constructor( private http: HttpClient ) { }

  cargarHospitales() {
    return this.http.get(`${ base_url }/hospitales`, this.headers )
            .pipe(
              map( (resp: { ok: boolean, hospitalesDB: Hospital[] }) => resp.hospitalesDB )
            );
  }

  crearHospital(nombre: string) {
    return this.http.post(`${base_url}/hospitales`, { nombre }, this.headers );
  }

  actualizarHospital(id: string, nombre: string) {
    return this.http.put(`${base_url}/hospitales/${id}`, { nombre }, this.headers);
  }

  eliminarHospital(id: string) {
    return this.http.delete(`${base_url}/hospitales/${id}`, this.headers);
  }


}

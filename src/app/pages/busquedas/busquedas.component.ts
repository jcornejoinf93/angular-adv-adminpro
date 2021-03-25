import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Medico } from 'src/app/models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styles: [
  ]
})
export class BusquedasComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private busquedaService: BusquedasService ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      const { termino } = params;
      console.log(termino);
      this.busquedaService.busquedaGlobal(termino).subscribe((resp: any) => {
        // console.log(resp);
        this.usuarios = resp.usuariosDB;
        this.medicos  = resp.medicosDB;
        this.hospitales = resp.hospitalesDB;
      });
    });
  }

}

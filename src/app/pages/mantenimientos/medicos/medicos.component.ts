import { Component, OnInit, OnDestroy } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  public sinResultado: boolean = false;
  public imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
               private modalImagenServices: ModalImagenService,
               private busquedaService: BusquedasService ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenServices.nuevaImagen
      .pipe(delay(300))
      .subscribe( img =>  this.cargarMedicos() );
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.medicoService.getMedicos().subscribe( (resp: any) => {
      //console.log(resp.medicosDB);
      this.medicos = resp.medicosDB;
      this.cargando = false;
    });
  }

  creaMedico() {
   // this.medicoService.crearMedico().subscribe
  }

  abrirModal(medico: Medico) {
    this.modalImagenServices.abrirModal('medicos', medico._id, medico.img);
  }

  buscar(termino: string) {
    if (termino.trim().length === 0) {
      this.cargarMedicos();
    }
    this.busquedaService.buscar('medicos', termino).subscribe( (resp: Medico[]) => {
      this.medicos = resp;
      if ( this.medicos.length === 0 ) {
        this.sinResultado = true;
      } else {
        this.sinResultado = false;
      }
    });
  }

  eliminarMedico(medico: Medico) {

    Swal.fire({
      title: 'Estás seguro de eliminar al médico?',
      text: medico.nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminaMedico(medico._id).subscribe((resp: any) => {
          // console.log(resp);
          Swal.fire(
            'Medico eliminado!',
            resp.msg,
            'success'
          );
        });
        this.cargarMedicos();
      }
    });
  }

}

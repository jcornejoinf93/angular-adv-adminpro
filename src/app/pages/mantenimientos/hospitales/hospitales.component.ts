import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public loading = true;
  public imgSubs: Subscription;
  public sinResultado: boolean = false;

  constructor( private hospitalService: HospitalService,
               private modalImagenServices: ModalImagenService,
               private busquedaServices: BusquedasService ) {}

  ngOnInit(): void {
    this.getHospitales();
    this.imgSubs = this.modalImagenServices.nuevaImagen
      .pipe(delay(300))
      .subscribe( img =>  this.getHospitales());
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      input: 'text',
      inputLabel: 'Ingrese el nombre del hospital',
      showCancelButton: true,
      inputPlaceholder: 'Agregar hospital'
    })
    if ( value.trim().length > 0) {
      //console.log(value);
      this.hospitalService.crearHospital(value).subscribe(
        (resp: any) => {
          this.hospitales.push(resp.hospitalDB);
          Swal.fire('Se agrega hospital', value, 'success');
        }
      );
    }
  }

  getHospitales(){
    this.hospitalService.cargarHospitales().subscribe( hospitales => {
      this.hospitales = hospitales;
      // this.hosptemp = hospitales;
      this.loading = false;
    });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre).subscribe(
      resp => {
        Swal.fire('Hospital actualizado', hospital.nombre, 'success');
      },
      err => {
        Swal.fire('Error', 'No fue posible actualizar el hospital', 'error');
      }
    );
  }

  borrarHospital(hospital: Hospital) {

    Swal.fire({
      title: 'Está seguro de eliminar el hospital seleccionado',
      text: `Se eliminará ${hospital.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.eliminarHospital(hospital._id).subscribe(
          resp => {
            this.getHospitales();
            Swal.fire('Hospital eliminado', '', 'success');
          },
          err => {
            Swal.fire('Error', 'Intente de nuevo', 'error');
          }
        );
      }
    });

  }

  abrirModal(hospital: Hospital) {
    this.modalImagenServices.abrirModal('hospitales', hospital._id, hospital.img);
  }


  buscarHospitales( termino: string ) {

    if( termino.trim().length === 0 ) {
      return this.getHospitales();
    }

    this.busquedaServices.buscar('hospitales', termino).subscribe(
      resp => {
        this.hospitales = resp as Hospital[];
        if (this.hospitales.length === 0) {
               this.sinResultado = true;
             } else {
               this.sinResultado = false;
             }
      }
    );
  }

}

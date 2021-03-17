import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public medicoSeleccionado: Medico;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activateRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.cargarHospitales();
    this.obtieneMedicoPorId();

    this.medicoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      hospital: ['', [Validators.required]]
    });

    this.medicoForm.get('hospital').valueChanges.subscribe( hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
    });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
    });
  }

  obtieneMedicoPorId() {
      this.activateRoute.params.subscribe(({id}) => {
        if ( id === 'nuevo' ) {
          return;
        }
        this.medicoService.getMedicoPorId(id)
                          .pipe(
                            delay(100)
                          )
                          .subscribe( medico => {
                            // if (!medico) {
                            //   this.router.navigateByUrl('/dashboard/medicos');
                            // }
                            const {nombre, hospital: { _id }} = medico;
                            this.medicoSeleccionado = medico;
                            this.medicoForm.setValue({ nombre, hospital: _id });
                        });
    });
  }

  guardarMedico(){

    if (this.medicoSeleccionado) {
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };

      this.medicoService.actualizarMedico(data).subscribe( resp => {
        const { nombre } = this.medicoForm.value;
        Swal.fire('Excelente', `Usuario ${ nombre } actualizado`, 'success');
      });
    } else {
      // Crear
      this.medicoService.crearMedico( this.medicoForm.value ).subscribe( (resp: any) => {
        Swal.fire('Se ha creado al usuario con exito', resp.medico.nombre, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
      },
      err => {
        Swal.fire('No fue posible crear al usuario', '', 'error');
      });
    }
  }
}

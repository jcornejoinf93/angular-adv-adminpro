import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public paginaDesde: number = 0;
  public loading: boolean = true;
  public imgSubs: Subscription;

  constructor(private usuariosServices: UsuarioService,
              private busquedaServices: BusquedasService,
              private modalImagenServices:ModalImagenService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenServices.nuevaImagen
      .pipe(delay(100))
      .subscribe( img =>  this.cargarUsuarios());
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios(){
    this.usuariosServices.cargarUsuarios(this.paginaDesde).subscribe(({ total, usuariosDB }) => {
      this.totalUsuarios = total;
      this.usuarios = usuariosDB;
      this.usuariosTemp = usuariosDB;
      this.loading = false;
    });
  }

  cambiarPagina( valor: number ) {
    this.paginaDesde += valor;

    if(this.paginaDesde < 0) {
      this.paginaDesde = 0;
    }
    if ( this.paginaDesde > this.totalUsuarios ) {
      this.paginaDesde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if( termino.trim().length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaServices.buscar('usuarios', termino).subscribe(
      resp => {
        this.usuarios = resp;
      }
    );
  }

  eliminarUsuario( usuario: Usuario ){
    if ( usuario.uid === this.usuariosServices.uid ) {
      Swal.fire('Error','No es posible eliminar su usuario', 'error');
      return;
    }
    Swal.fire({
      title: 'Estas seguro de eliminar el usuario seleccionado?',
      text: `Se borrará el usuario ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosServices.eliminarUsuario(usuario).subscribe((resp: any) => {
          Swal.fire(
            'Usuario eliminado!',
            resp.usuarioBorrado.nombre,
            'success'
          );

          this.cargarUsuarios();
        });

      }
    });
  }

  cambiarRole( usuario: Usuario ) {
    this.usuariosServices.guardaUsuario(usuario).subscribe( resp => {
      //console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    //console.log(usuario);
    this.modalImagenServices.abrirModal('usuarios', usuario.uid, usuario.img);
  }


}
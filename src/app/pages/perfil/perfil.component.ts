import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

import Swal from 'sweetalert2'
import { FileUploadService } from '../../services/file-upload.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  public profileForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) {
      this.usuario = usuarioService.usuario;
    }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarUsuario(this.profileForm.value).subscribe(
      (resp: any) => {
        //console.log(resp);
        this.usuario.nombre = resp.usuarioActualizado.nombre;
        this.usuario.email = resp.usuarioActualizado.email;
        Swal.fire(
          'Usuario actualizado',
          'Se cambia la información del usuario en Base de Datos',
          'success'
        );
      }, (err) => {
        //console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'No se ha podido actualizar el usuario',
          text: err.error.msg,
          footer: ''
        })
      }
    );
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;
    if (!file) {
      return this.imgTemp = '';
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
        .then( img => {
          this.usuario.img = img;
          Swal.fire('Muy bien', 'Se ha cambiado la imagen', 'success');
        })
        .catch( err => {
          console.log(err);
          Swal.fire('Terrible', 'No ha sido posible cambiar la imagen', 'error');
        });
    
  }

}

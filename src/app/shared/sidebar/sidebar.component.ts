import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  // public menuItems: any[];
  public usuario: Usuario;

  constructor( public _sidebarServices: SidebarService,
               private usuarioService: UsuarioService ) {
    // this.menuItems = _sidebarServices.menu;
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
  }

}

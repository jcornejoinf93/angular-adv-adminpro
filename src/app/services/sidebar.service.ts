import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu() {
    this.menu = JSON.parse( localStorage.getItem('menu')) || [];
  }



  // menu: any[] = [
  //   {
  //     titulo: 'Principal!!',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Gráficas', url: 'grafica1' },
  //       { titulo: 'Main', url: '/' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //       { titulo: 'Promesas', url: 'promesa' },
  //       { titulo: 'Rxjs', url: 'rxjs' }
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Médicos', url: 'medicos' },
  //       //{ titulo: 'Médico', url: 'medico/:id' }
  //     ]
  //   }
  // ];

}

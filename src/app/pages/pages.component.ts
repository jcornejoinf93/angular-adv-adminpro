import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor( private _settingsService: SettingsService,
               private sideberService: SidebarService ) {}

  ngOnInit(): void {
    customInitFunctions();
    this.sideberService.cargarMenu();
    console.log(this.sideberService.menu);
  }

}

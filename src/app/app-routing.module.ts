import { NgModule } from '@angular/core';

// Modules
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';


const routes: Routes = [

  //path: '/dashboard' = PagesRouting
  //path: '/dashboard' = PagesRoutingModule
  //path: '/auth' = AuthRoutingModule
  { path: '', pathMatch: 'full', redirectTo: '/dashboard'},
  { path: '**', component: NopagefoundComponent }
  
]



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot( routes ),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

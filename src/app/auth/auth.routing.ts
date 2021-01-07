import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthModule } from './auth.module';

const ROUTES: Routes = [
    
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent }
]

@NgModule({
    imports: [
        RouterModule.forChild( ROUTES )
    ],
    exports: [ RouterModule ]
})

export class AuthRoutingModule { }

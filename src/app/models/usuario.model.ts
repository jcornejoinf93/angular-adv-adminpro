import { environment } from '../../environments/environment';

const baseURL = environment.base_url;

export class Usuario {
    constructor(
                public nombre: string,
                public email: string,
                public password?: string,
                public google?: boolean,
                public role?: string,
                public img?: string,
                public uid?: string
        ) {
        google = false;
        role = 'USER_ROLE';
    }

    get imagenUrl() {
        if ( !this.img ) {
            return `${ baseURL }/uploads/usuarios/no-image`;
        } else if ( this.img.includes('https') ) {
            return this.img;
        } else if ( this.img ) {
            return `${ baseURL }/uploads/usuarios/${ this.img }`;
        } else {
            return `${ baseURL }/uploads/usuarios/no-image`;
        }
    }

}
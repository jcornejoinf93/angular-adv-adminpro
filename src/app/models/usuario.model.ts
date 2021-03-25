import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class Usuario {
    constructor(
                public nombre: string,
                public email: string,
                public password?: string,
                public google?: boolean,
                public role?: 'ADMIN_ROLE' | 'USER_ROLE',
                public img?: string,
                public uid?: string
        ) {
        google = false;
        role = 'USER_ROLE';
    }

    get imagenUrl() {

        if ( !this.img ) {
            return `${ base_url }/uploads/usuarios/4c2303d5-0774-4691-9c4b-38e810cddf6d.jpg`;
        } else if ( this.img.includes('https') ) {
            return this.img;
        } else if ( this.img ) {
            return `${ base_url }/uploads/usuarios/${ this.img }`;
        } else {
            return `${ base_url }/uploads/usuarios/no-image`;
        }
    }

}
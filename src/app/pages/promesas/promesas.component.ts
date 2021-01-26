import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    //this.getUsuarios().then(usuarios => console.log(usuarios));

    //const promesa = new Promise( (resolve, reject) => {
    //  if(false){
    //    resolve('Hola mundo es el resolve');
    //  } else {
    //    reject('algo salió mal');
    //  }
    //  
    //});
//
    //promesa.then( (mensaje) => {
    //  console.log(mensaje);
    //})
    //.catch( err => {
    //  console.log('Error controlado en mi promesa', err);
    //})
//
    //console.log('Fin del init');
  }

  getUsuarios(){

    const promesa = new Promise(resolve => {
      fetch('https://reqres.in/api/users')
                .then( resp =>  resp.json())
                .then( body =>  resolve(body.data));
    });

    return promesa;

    
  }

}

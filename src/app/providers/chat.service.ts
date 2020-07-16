import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { mensaje } from "../interface/mensaje.interface";
import { map } from "rxjs/operators";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private itemsCollection: AngularFirestoreCollection<mensaje>;
    public chats: mensaje[]=[];
    public usuario:any={};
  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) { 
    //se escucha cualquier cambio que haya en el estado de la autenticacion
    this.afAuth.authState.subscribe(user =>{
      console.log("user:",user);
//Si no existe el usuario,haga un return para no romper el codigo
      if(!user){
        return;
      }
      //si existe el usuario,cree una propiedad dentro del objeto  llamada nombre
      this.usuario.nombre = user.displayName;
      //se usa el uid para registrar de forma unica el mensaje de un usuario en particular
      this.usuario.uid = user.uid;
    })
  }

  login(proveedor:string) {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<mensaje>('chats', ref => ref.orderBy('fecha', 'desc'));
    return this.itemsCollection.valueChanges().
    pipe( map((mensajes: mensaje[])=>{
      console.log(mensajes);
      this.chats = [];
      

      for(let mensaje of mensajes){
        this.chats.unshift( mensaje );
      }

      
    })
   )

  }
//Se agregan mensajes a firebase
  agregarMensaje(texto:string){
    let mensaje:mensaje={
      nombre:'Andres',
      mensaje:texto,
      fecha: new Date().getTime()
    }
     return this.itemsCollection.add(mensaje);
  }
}

import { Component } from '@angular/core';
import firebase from 'firebase';

import { NavController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  captureDataUrl: string;
  alertCtrl: AlertController;
  name:string;
  constructor(public navCtrl: NavController, alertCtrl: AlertController,private camera: Camera) {
    this.alertCtrl = alertCtrl;
  }

  capture() {
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  upload() {
   let storageRef = firebase.storage().ref();

     const filename = Math.floor(Date.now() / 1000);

    console.log(storageRef);
    // Create a reference to 'images/todays-date.jpg'
     const imageRef = storageRef.child(`images/${filename}.jpg`);
     imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
       this.showSuccesfulUploadAlert();  
       this.name = snapshot.metadata.name; 
    //  alert(snapshot.bytesTransferred);
    //  alert(snapshot.downloadURL);
    //  alert(snapshot.metadata.name);
    //  alert(snapshot.ref.name);
    //  alert(snapshot.state);
    //  alert(snapshot.task);
     
  });

  }
  showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      title: 'Uploaded!',
      subTitle: 'Picture is uploaded to Firebase',
      buttons: ['OK']
    });
    alert.present();

    // clear the previous photo data in the variable
    this.captureDataUrl = "";
  }

  private basePath = '/images';



  delete(){

    this.deleteFileStorage(this.name);
  }
  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref()
    storageRef.child(`${this.basePath}/${name}`).delete()
  }
}

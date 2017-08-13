import firebase from 'firebase'
import {Camera} from 'ionic-native';
import {Injectable} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import {Platform, ActionSheetController} from 'ionic-angular';

import {AuthService} from "../providers/auth-service/auth-service";
import {resources} from "../app/app.resources";
import {Dialogs} from "@ionic-native/dialogs";

@Injectable()
export class CaptureService {

  public isNative: boolean = false;
  public eventList: any[] = [];
  public location: any = {};
  public locationWatch: any;

  constructor(private platform: Platform,
              private dialogs: Dialogs,
              private authService: AuthService,
              private geolocation: Geolocation,
              private actionsheetCtrl: ActionSheetController) {

    // Try and detect if this is a browser
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.isNative = false;
    } else {
      this.isNative = true;
    }

    console.info('~~> Capture service started...', {
      native: this.isNative
    })
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Capture Data',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Capture Location',
          icon: !this.platform.is('ios') ? 'pin' : null,
          handler: () => {
            this.captureLocation();
          }
        },
        {
          text: 'Take Picture',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.capturePicture();
          }
        },
        /*
         {
         text: 'Scan Barcode',
         icon: !this.platform.is('ios') ? 'barcode' : null,
         handler: () => {
         this.captureBarCode();
         }
         },
         */
        {
          text: 'Clear List',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            this.clearCache();
          }
        }
      ]
    });

    actionSheet.present();
  }

  createEvent(type: string, options?: Object) {
    let event = {
      type: type,
      title: 'Pending Capture',
    };

    // Apply options
    Object.assign(event, options || {});

    return this.authService.getUser()
      .then((user: firebase.User) => {
        // Attach user info
        Object.assign(event, {
          user: user ? {
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
            } : null,
        });
        this.eventList.push(event);
        return event;
      });
  }

  attachEvent(event) {
    // TODO: Attach event to something
    this.removeEvent(event, true);
  }

  uploadEvent(event) {
    // ToDo: Upload event
    this.removeEvent(event, true);
  }

  removeEvent(event: any, confirmed?: boolean) {
    const commit = () => {
      const index = this.eventList.indexOf(event);
      if (index >= 0) {
        this.eventList.splice(index, 1);
      }
    };

    if (confirmed) {
      commit();
    } else {
      this.confirm('Are you sure you want to remove this event?')
        .then(() => {
          commit();
        })
        .catch(e => console.log('Error displaying dialog', e));
    }
  }

  captureLocation() {
    if (this.isNative) {
      return this.captureLocationDevice();
    } else {
      return this.captureLocationBrowser()
    }
  }

  captureLocationCoors(info) {
    if (info && info.coords) {
      console.log('~~> Capture Location: ', info);
      Object.assign(this.location, info);
      return this.createEvent('location', {
        title: 'Captured Location',
        location: info,
      }).then((event: any) => {
        Object.assign(event, {
          text: (event.user ? event.user.name : 'Anonymous') + ' checked in on device @ ' + new Date().toUTCString(),
          image: (event.user && event.user.photo ? event.user.photo : resources.imageDefault),
        });
        return event;
      });
    } else {
      return Promise.reject(new Error('Location not available'));
    }
  }

  captureLocationBrowser() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.captureLocationCoors(pos).then(resolve).catch(reject);
          },
          (error) => {
            console.error(error);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
      } else {
        reject(new Error('Location not available'));
      }
    });
  }

  captureLocationDevice() {
    if (!this.location) {
      this.locationWatch = this.geolocation.watchPosition();
      this.locationWatch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        if (data.coords) {
          console.log('Location updated:', data.coords);
          this.location['coords'] = data.coords;
        }
      });
    }

    this.geolocation.getCurrentPosition()
      .then((pos) => this.captureLocationCoors(pos))
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }

  capturePicture() {
    if (this.isNative) {
      return this.capturePictureDevice();
    } else {
      return this.capturePictureBrowser()
    }
  }

  capturePictureBrowser() {
    let input: any = document.getElementById('PhotoPicker');
    if (input) {
      input.click(); // Deferred to input change event
      return Promise.resolve(null);
    } else {
      return Promise.reject(new Error('PhotoPicker input not found.'));
    }
  }

  capturePictureChanged(evt) {
    evt.preventDefault();
    if (evt.target.files && evt.target.files.length === 0) return;
    var reader = new FileReader();
    let imageFile = evt.target.files[0];
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      // TODO: Apply EXIF
      // this.applyEXIF(imageFile);
      this.createEvent('picture', {
        title: 'Browser Upload',
        text: 'Uploaded from browser @ ' + new Date().toUTCString(),
        image: reader.result
      });
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  capturePictureDevice() {
    return Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // Image Captured
      return this.createEvent('picture', {
        title: 'Captured Image',
        text: 'Image captured on device @ ' + new Date().toUTCString(),
        image: 'data:image/jpeg;base64,' + imageData, // imageData is a base64 encoded string
      });
    }, (err) => {
      console.log(err);
    });
  }

  captureBarCode() {
    this.eventList.push({
      type: 'barcode',
      title: 'Scanned Barcode',
      text: '7826348721394',
    });
  }

  applyEXIF(imageFile: File) {
    // ToDo: Implement...
    // - http://www.nihilogic.dk/labs/exif/exif.js
    // - http://www.nihilogic.dk/labs/binaryajax/binaryajax.js
    var binaryReader = new FileReader();
    binaryReader.onloadend = function (d) {
      /*
       var width;
       var height;
       var exif, transform = "none";
       exif=EXIF.readFromBinaryFile(createBinaryFile(d.target.result));

       if (exif.Orientation === 8) {
       width = img.height;
       height = img.width;
       transform = "left";
       } else if (exif.Orientation === 6) {
       width = img.height;
       height = img.width;
       transform = "right";
       }
       */
    };
    binaryReader.readAsArrayBuffer(imageFile);
  }

  clearCache() {
    this.eventList = [];
  }

  confirm(message: string) {
    if (this.isNative) {
      // Native dislog
      return this.dialogs.alert(message);
    } else {
      // Web dialog
      return new Promise((resolve, reject) => {
        if (confirm(message)) {
          resolve();
        } else {
          reject();
        }
      });
    }
  }
}

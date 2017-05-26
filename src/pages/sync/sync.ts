import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html'
})
export class SyncPage {

  direction: string = '';
  items: any[] = [];

  constructor(public navCtrl: NavController) {
    this.initializeItems();
  }

  initializeItems() {
    this.items = [
      {
        dir: 'uploads',
        type: 'location',
        title: 'Johnny checked in',
        text: 'Brussels, Belgium',
        image: null,
      },
      {
        dir: 'uploads',
        type: 'picture',
        title: 'Captured Image',
        text: 'This image was captured at 14:21 PM on the 25\'th of May 2017.',
        image: null,
      },
      {
        dir: 'uploads',
        type: 'barcode',
        title: 'Scanned Barcode',
        text: '7826348721394',
      },
      {
        dir: 'downloads',
        type: 'update',
        icon: 'cloud-download',
        title: 'Check for updates...',
        text: 'Check online for any updates',
      },
    ];
  }

  syncAll() {
    this.items = this.items.filter((item) => false);
  }

  syncUp() {
    this.items = this.items.filter((item) => item.dir === 'downloads');
  }

  syncDown() {
    this.items = this.items.filter((item) => item.dir === 'uploadss');
  }

}

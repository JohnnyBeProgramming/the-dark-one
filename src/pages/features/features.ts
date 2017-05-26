import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-features',
  templateUrl: 'features.html'
})
export class FeaturesPage {

  category: string = '';
  searchQuery: string = '';
  items: any[];

  constructor(public navCtrl: NavController) {
    this.initializeItems();
  }

  initializeItems() {
    this.items = [
      {
        category: 'capture',
        title: 'QR Code Scanner',
        text: 'Scan QR codes of URLs, Text Messages, Phone Numbers and more...',
      },
      {
        category: 'manage',
        title: 'Task Management',
        text: 'Define assignments and complete tasks in your task list',
      },
      {
        category: 'storage',
        title: 'Cloud Storage Sync',
        text: 'Synchronise your local data with one of the supported cloud providers.',
      },
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.title && item.title.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.text && item.text.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}

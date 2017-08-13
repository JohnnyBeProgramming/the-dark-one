import {Injectable} from '@angular/core';
import {Platform, ActionSheetController} from 'ionic-angular';

export interface ISyncItem {
  dir: string;
  type: string;
  icon?: string;
  image?: string;
  title?: string;
  text?: string;
}

const samples: ISyncItem[] = [
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

@Injectable()
export class SyncService {

  private syncItems = [];

  constructor(public platform: Platform) {

    this.getUpdates()
      .then((updateList) => {
        this.syncItems = this.syncItems.concat(updateList);
      });

  }

  getPendingItems() {
    return Promise.resolve(this.syncItems);
  }

  getUpdates() {
    return new Promise((resolve, reject) => {
      resolve([
        {
          dir: 'downloads',
          type: 'update',
          icon: 'cloud-download',
          title: 'Check for updates...',
          text: 'Check online for any updates',
        },
      ]);
    });
  }

  uploadEvent(event) {
    return new Promise((resolve, reject) => {
      const item = {dir: 'uploads'};
      Object.assign(item, event);
      this.syncItems.push(item);
      resolve(item);
    });
  }

  getSyncItems(direction: string = '', searchText: string = '') {
    return this.getPendingItems()
      .then((results) => {
        if (direction && direction.trim() != '') {
          // Filter on the specified search text.
          return results.filter((item) => {
            return (item.dir && item.dir.toLowerCase().indexOf(direction.toLowerCase()) > -1);
          })
        }
        return results;
      })
      .then((results) => {
        // if the value is an empty string don't filter the items
        if (searchText && searchText.trim() != '') {
          // Filter on the specified search text.
          return results.filter((item) => {
            return (item.title && item.title.toLowerCase().indexOf(searchText.toLowerCase()) > -1) ||
              (item.text && item.text.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
          })
        }
        return results;
      });
  }

  syncAll() {
    return this.getPendingItems().then((items) => {
      return items.filter((item) => true);
    });
  }

  syncUp() {
    return this.getPendingItems().then((items) => {
      return items.filter((item) => item.dir === 'uploads');
    });
  }

  syncDown() {
    return this.getPendingItems().then((items) => {
      return items.filter((item) => item.dir === 'downloads');
    });
  }

}

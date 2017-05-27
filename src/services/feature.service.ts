import {Injectable} from '@angular/core';
import {Platform, ActionSheetController} from 'ionic-angular';

export interface IFeature {
  category: string;
  title: string;
  text: string;
}

const samples: IFeature[] = [
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

@Injectable()
export class FeatureService {

  constructor(public platform: Platform,
              public actionsheetCtrl: ActionSheetController) {
  }

  getFeatures(searchText: string = '', category: string = '') {
    return Promise.resolve(samples)
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
      })
      .then((results) => {
        if (category && category.trim() != '') {
          // Filter on the specified search text.
          return results.filter((item) => {
            return (item.category && item.category.toLowerCase().indexOf(category.toLowerCase()) > -1);
          })
        }
        return results;
      });
  }
}

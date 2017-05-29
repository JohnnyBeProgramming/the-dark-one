import {Injectable} from '@angular/core';
import {Platform, ActionSheetController} from 'ionic-angular';

export interface IStorageItem {
  name: string;
  type: string;
  created?: string;
  updated?: string;
}

const cache: any = {};

@Injectable()
export class StorageService {

  constructor(public platform: Platform,
              public actionsheetCtrl: ActionSheetController) {
  }

  get(name: string = null) {
    if (!name) Promise.reject(new Error('name required'));
    return Promise.resolve(cache[name])
      .then((storage) => {
        return JSON.parse(storage[name]);
      });
  }

  set(name: string = null, payload: any) {
    if (!name) Promise.reject(new Error('name required'));
    return Promise.resolve(cache)
      .then((storage) => {
        storage[name] = JSON.stringify(payload);
      });
  }

}

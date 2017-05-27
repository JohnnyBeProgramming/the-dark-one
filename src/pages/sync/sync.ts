import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SyncService, ISyncItem} from "../../services/sync.service";

@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html'
})
export class SyncPage {

  loading: boolean = false;
  direction: string = '';
  items: ISyncItem[] = [];

  constructor(public navCtrl: NavController,
              public syncService: SyncService) {

    // Load the pending items (async)
    this.loading = true;
    this.syncService
      .getSyncItems()
      .then((results: ISyncItem[]) => {
        this.items = results;
        this.loading = false;
      });

  }

  syncAll() {
    this.loading = true;
    this.syncService
      .syncAll()
      .then((synced: ISyncItem[]) => {
        this.items = this.items.filter(item => {
          return synced.indexOf(item) < 0;
        });
        this.loading = false;
      });
  }

  syncUp() {
    this.loading = true;
    this.syncService
      .syncUp()
      .then((synced: ISyncItem[]) => {
        this.items = this.items.filter(item => {
          return synced.indexOf(item) < 0;
        });
        this.loading = false;
      });
  }

  syncDown() {
    this.loading = true;
    this.syncService
      .syncDown()
      .then((synced: ISyncItem[]) => {
        this.items = this.items.filter(item => {
          return synced.indexOf(item) < 0;
        });
        this.loading = false;
      });
  }

}

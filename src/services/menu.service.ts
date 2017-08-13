import {Injectable} from '@angular/core';

import {TabsPage} from "../pages/tabs/tabs";
import {PluginsPage} from "../pages/plugins/plugins";
import {SyncPage} from "../pages/sync/sync";
import {CapturePage} from "../pages/capture/capture";
import {AboutPage} from "../pages/about/about";

@Injectable()
export class MenuService {

  pages: Array<{title: string, icon: string, component: any}>;

  constructor() {

    // Define the tab pages...
    this.pages = [
      {title: 'Home', icon: 'home', component: TabsPage},
      {title: 'Capture', icon: 'camera', component: CapturePage},
      {title: 'Features', icon: 'logo-buffer', component: PluginsPage},
      {title: 'Cloud Sync', icon: 'cloud', component: SyncPage},
      {title: 'About', icon: 'information-circle', component: AboutPage}
    ];
  }

  getPages() {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.pages);
      } catch (ex) {
        reject(ex);
      }
    });
  }
}


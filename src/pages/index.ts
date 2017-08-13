import {Component, ViewChild} from '@angular/core';
import {Nav} from 'ionic-angular';

import {MenuService} from "../services/menu.service";
import {TabsPage} from "./tabs/tabs";

@Component({
  selector: 'page-index',
  templateUrl: 'index.html'
})
export class IndexPage {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;
  pages: Array<{title: string, icon: string, component: any}>;

  constructor(private menuService: MenuService) {
    // Define the tab pages...
    this.menuService.getPages()
      .then((pages: Array<{title: string, icon: string, component: any}>) => {
        this.pages = pages;
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}

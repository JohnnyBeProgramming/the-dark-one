import {Component} from '@angular/core';
import {TabsPage} from "./tabs/tabs";

@Component({
  selector: 'page-index',
  templateUrl: 'index.html'
})
export class IndexPage {

  rootPage: any = TabsPage;

  constructor() {}

}

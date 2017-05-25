import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { CapturePage } from '../capture/capture';
import { ToolsPage } from '../tools/tools';
import { SyncPage } from '../sync/sync';
import { AboutPage } from '../about/about';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CapturePage;
  tab3Root = ToolsPage;
  tab4Root = SyncPage;
  tab5Root = AboutPage;

  constructor() {

  }
}

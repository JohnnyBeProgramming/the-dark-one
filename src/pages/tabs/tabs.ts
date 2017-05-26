import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { CapturePage } from '../capture/capture';
import { FeaturesPage } from '../features/features';
import { SyncPage } from '../sync/sync';
import { AboutPage } from '../about/about';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CapturePage;
  tab3Root = FeaturesPage;
  tab4Root = SyncPage;
  tab5Root = AboutPage;

  constructor() {

  }
}

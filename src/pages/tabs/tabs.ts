import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {HomePage} from '../home/home';
import {CapturePage} from '../capture/capture';
import {FeaturesPage} from '../features/features';
import {SyncPage} from '../sync/sync';
import {AboutPage} from '../about/about';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit, OnDestroy {

  private sub: any;

  tab1Root = HomePage;
  tab2Root = CapturePage;
  tab3Root = FeaturesPage;
  tab4Root = SyncPage;
  tab5Root = AboutPage;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      console.log('~~> Params: ', params);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

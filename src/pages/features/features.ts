import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FeatureService, IFeature} from "../../services/feature.service";

@Component({
  selector: 'page-features',
  templateUrl: 'features.html'
})
export class FeaturesPage {

  category: string = '';
  searchQuery: string = '';
  features: IFeature[] = [];

  constructor(public navCtrl: NavController,
              public featureService: FeatureService) {

    // Load the feaures Async
    this.featureService
      .getFeatures(this.searchQuery, this.category)
      .then((results: IFeature[]) => {
        this.features = results;
      });

  }

  filterItems(searchText: string = '', category: string = '') {
    this.searchQuery = searchText;
    this.featureService
      .getFeatures(searchText, category)
      .then((results) => {
        this.features = results;
      });
  }

}

import {Injectable} from '@angular/core';
import {Platform, ActionSheetController} from 'ionic-angular';

export interface IFeature {
  locked?: boolean;
  enabled?: boolean;
  installed?: boolean;
  category: string;
  title: string;
  text: string;
  link?: {
    icon?: string;
    label: string;
  }
}

@Injectable()
export class FeatureService {

  private features: IFeature[] = null;

  constructor(public platform: Platform,
              public actionsheetCtrl: ActionSheetController) {

    // Load the features (async)
    this.loadFeatures().then((features) => {
      this.features = features;
    });
  }

  loadFeatures() {
    if (this.features) {
      return Promise.resolve(this.features);
    }

    // Define defaults...
    // ToDo: Async load from cache
    const staticFeatures: IFeature[] = [
      {
        enabled: false,
        installed: true,
        category: 'system',
        title: 'Capture Service',
        text: 'Enables you to capture data, such as pictures, locations or bar codes.',
        link: {
          icon: 'camera',
          label: 'Capture',
        }
      },
      {
        locked: true,
        enabled: true,
        installed: true,
        category: 'system',
        title: 'Feature Services',
        text: 'Manage your application plugins and features for this device.',
        link: {
          icon: 'logo-buffer',
          label: 'Plugins',
        }
      },
      {
        enabled: false,
        installed: true,
        category: 'system',
        title: 'Cloud Sync',
        text: 'Synchronise your data to the cloud and download updates or features.',
        link: {
          icon: 'cloud',
          label: 'Cloud Sync',
        }
      },
    ];
    return Promise.resolve(staticFeatures);
  }

  getFeatures(searchText: string = '', category: string = '') {
    const hasText = (target, lowerText) => {
      return target && target.toLowerCase().indexOf(lowerText) > -1;
    };
    return this.loadFeatures()
      .then((results) => {
        // Filter by category
        if (category && category.trim() != '') {
          return results.filter((item) => hasText(item.category, category.toLowerCase()))
        }
        return results;
      })
      .then((results) => {
        // Filter on the search text
        const term = !searchText ? '' : searchText.toLowerCase();
        if (term && term.trim() != '') {
          // Filter on the specified search text.
          return results.filter((item) => {
            return hasText(item.title, term)
              || hasText(item.text, term)
              || hasText(item.category, term);
          })
        }
        return results;
      });
  }
}

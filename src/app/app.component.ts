import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.component.html'
})
export class MyApp {

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#2c3e50");

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window['cordova'] && window['cordova'].plugins.Keyboard) {
        window['cordova'].plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      // Show the contents...
      splashScreen.hide();
    });
  }
}

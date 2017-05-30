import {NgModule, ErrorHandler} from '@angular/core';
import {FormsModule}    from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {BaseRequestOptions} from '@angular/http';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';

import {MyApp} from './app.component';
import {routing} from './app.routing';

import {TabsPage} from '../pages/tabs/tabs';
import {HomePage} from '../pages/home/home';
import {CapturePage} from '../pages/capture/capture';
import {FeaturesPage} from '../pages/features/features';
import {SyncPage} from '../pages/sync/sync';
import {AboutPage} from '../pages/about/about';
import {LoginPage} from '../pages/login/index';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {AuthenticationService} from '../services/auth.service';
import {FeatureService} from "../services/feature.service";
import {CaptureService} from "../services/capture.service";
import {SyncService} from "../services/sync.service";
import {StorageService} from "../services/storage.service";

import {AuthGuard} from '../routes/auth.gaurd';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    //routing
  ],
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    CapturePage,
    FeaturesPage,
    SyncPage,
    AboutPage,
    TabsPage
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CapturePage,
    FeaturesPage,
    SyncPage,
    AboutPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    AuthGuard,
    AuthenticationService,
    CaptureService,
    FeatureService,
    SyncService,
    StorageService,
    BaseRequestOptions
  ]
})
export class AppModule {
}

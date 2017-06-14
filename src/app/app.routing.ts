import {Routes, RouterModule} from '@angular/router';

import {IndexPage} from '../pages/index';
import {LoginPage} from '../pages/login/index';
import {AuthGuard} from '../routes/auth.gaurd';
import {AboutPage} from "../pages/about/about";
import {CapturePage} from "../pages/capture/capture";
import {SyncPage} from "../pages/sync/sync";
import {FeaturesPage} from "../pages/features/features";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: '',
    component: IndexPage,
    //canActivate: [AuthGuard],
  },
  {
    path: 'capture',
    component: CapturePage,
    canActivate: [AuthGuard],
  },
  {
    path: 'features',
    component: FeaturesPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'sync',
    component: SyncPage,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutPage
  },

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes, {useHash: true});

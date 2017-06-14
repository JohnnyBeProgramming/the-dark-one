import {Routes, RouterModule} from '@angular/router';

import {IndexPage} from '../pages/index';
import {LoginPage} from '../pages/login/index';
import {AuthGuard} from '../routes/auth.gaurd';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: '',
    component: IndexPage,
    canActivate: [AuthGuard],
  },

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes, {useHash: true});

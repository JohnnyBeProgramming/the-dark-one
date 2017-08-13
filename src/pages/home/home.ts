import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from "../../services/auth.service";
import {resources} from "../../app/app.resources";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public loading: boolean = true;
  public imageDefault: string = resources.imageDefault;

  constructor(private router: Router,
              public authService: AuthService) {
    this.authService.getUser()
      .then((user) => {
        this.loading = false;
      })
  }

  login() {
    // not logged in so redirect to login page
    this.loading = true;
    this.router.navigate(['/login']);
  }

  showUserInfo() {
    // not logged in so redirect to login page
    this.loading = true;
    this.router.navigate(['/about']);
  }

}

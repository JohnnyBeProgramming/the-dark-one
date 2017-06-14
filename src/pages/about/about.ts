import {Component} from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../../providers/auth-service/auth-service";
import {resources} from "../../app/app.resources";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public loading: boolean;
  public imageDefault: string = resources.imageDefault;

  constructor(private router: Router,
              public authService: AuthService) {
  }

  login() {
    // not logged in so redirect to login page
    this.loading = true;
    this.router.navigate(['/login']);
  }

  logout() {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.signOut()
        .then(() => {
          this.router.navigate(['/login']);
          location.reload(true);
        });
    }
  }

}

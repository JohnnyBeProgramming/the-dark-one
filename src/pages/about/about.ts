import {Component} from '@angular/core';
import {AuthenticationService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  logout() {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('currentUser');
      this.authenticationService.logout();
      //this.router.navigate(['/login']);
      location.reload(true);
    }
  }

}

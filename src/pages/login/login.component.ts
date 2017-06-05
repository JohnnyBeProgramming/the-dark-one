import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../services/auth.service';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginPage implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  login() {
    this.loading = true;

    // ---------------------------------------------------------
    // ToDo: Remove temp code....
    // ---------------------------------------------------------
    if (this.model.username && this.model.password) {
      const token = JSON.stringify({
        username: this.model.username,
        token: ""
      });
      localStorage.setItem('currentUser', token);
      this.authenticationService.token = token;
      this.router.navigate(['/']);
      return true;
    }
    // ---------------------------------------------------------

    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/']);
        } else {
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }
      });
  }
}

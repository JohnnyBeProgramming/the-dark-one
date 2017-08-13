import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from "../../services/auth.service";

@Component({
  templateUrl: 'login.component.html'
})
export class LoginPage implements OnInit {
  loading = false;
  model: any = {};
  error: Error;

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    // reset login status
    this.authService.signOut();
  }

  login(provider: string) {
    this.error = null;
    this.loading = true;
    return Promise
      .resolve({name: provider})
      .then((provider: any) => {
        // Login with the authentication service....
        return this.authService.login(provider.name, this.model);
      })
      .then((result) => {
        this.loading = false;
        if (result) {
          this.router.navigate(['/']);
        }
        return result;
      })
      .catch((err) => {
        this.error = err;
        this.loading = false;
      });
  }
}

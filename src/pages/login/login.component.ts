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

  login(provider: string) {
    this.loading = true;
    switch (provider) {
      case 'google':
        console.info('~~> GOOGLE', window['plugins']);
        if (window['plugins']) {
          window['plugins'].googleplus.login(
            {},
            function (user_data) {
              console.log(user_data);

              //for the purpose of this example I will store user data on local storage
              console.warn('~~> User Date:', {
                userID: user_data.userId,
                name: user_data.displayName,
                email: user_data.email,
                picture: user_data.imageUrl,
                accessToken: user_data.accessToken,
                idToken: user_data.idToken
              });

              // Reroute to home page
              this.router.navigate(['/']);
            },
            function (msg) {
              console.log(msg);
            }
          );

        }
        this.loading = false;
        break;
      case 'facebook':
        console.warn('~~> TODO: Facebook...');
        this.loading = false;
        break;
      default:
        this.authenticationService.login(this.model.username, this.model.password)
          .subscribe(result => {
            if (result === true) {
              this.router.navigate(['/']);
            } else {
              this.error = 'Username or password is incorrect';
            }
            this.loading = false;
          });
        break;
    }
  }
}

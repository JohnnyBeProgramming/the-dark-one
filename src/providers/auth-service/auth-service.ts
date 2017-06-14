import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

// Do not import from 'firebase' as you'll lose the tree shaking benefits
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  public currentUser: firebase.User;

  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe((user: firebase.User) => this.currentUser = user);
  }

  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  login(provider: string, model: any = {}) {
    return Promise.resolve(model || {})
      .then((args: any) => {
        switch (provider) {
          case 'google':
            return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
          case 'facebook':
            return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
          default:
            const email = args.username;
            const pass = args.password;
            return this.afAuth.auth.signInWithEmailAndPassword(email, pass)
              .then((user) => {
                return {user};
              });
        }
      })
      .then((info) => {
        console.info('~~> Login Result:', info);
        this.currentUser = info.user;

        // store username and jwt token in local storage to keep user logged in between page refreshes
        //localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

        return info;
      });
  }

  context(provider: string) {
    return Promise.resolve(this.currentUser)
      .then((user) => {
        if (!user) {
          return this.login(provider).then(() => {
            return this.currentUser;
          });
        }
        return user;
      });
  }

  signOut(): firebase.Promise < any > {
    console.info('~~> Signing out...');
    return this.afAuth.auth.signOut()
      .then((result) => {
        console.info('~~> Signed out:', result);
        this.currentUser = null;
        localStorage.removeItem('currentUser');
      });
  }

  displayName(): string {
    if (this.currentUser) {
      return this.currentUser.displayName;
    }
    return 'Unknown User';
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { admin, operador, guest, Token, User } from './interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(guest);

  // private userReq$ = this.http.get<User>('/me');
  private userReq$ = of(admin);
  private operadorReq$ = of(operador);

  constructor(  private http: HttpClient,
                private token: TokenService
  ) {


    // original
    // this.token
    // .change()
    // .pipe(
    //   switchMap(() => iif(() => this.check(), this.userReq$, of(guest) )),
    //   map(user => Object.assign({}, guest, user))
    // )
    // .subscribe(user => this.user$.next(user));



    /// emulacion ROL
    let email = this.token.get().email;

    if (email === 'admin@hidroelectrica.com') {
        this.token
            .change()
            .pipe(
              switchMap(() => iif(() => this.check(), this.userReq$, of(guest) )),
              map(user => Object.assign({}, guest, user))
            )
            .subscribe(user => this.user$.next(user));
    } else {
        this.token
            .change()
            .pipe(
              switchMap(() => iif(() => this.check(), this.operadorReq$, of(guest) )),
              map(user => Object.assign({}, guest, user))
            )
            .subscribe(user => this.user$.next(user));
    }


  }

  setUser(user) {
    this.user$.next(user);
  }

  check() {
    return this.token.valid();
  }

  login(email: string, password: string, rememberMe = false) {


    // return this.http
    //   .post<Token>('/auth/login', { email, password, remember_me: rememberMe })
    //   .pipe(
    //     tap(token => this.token.set(token)),
    //     map(() => this.check())
    //   );

    const _token = {
                      access_token: 'MW56YjMyOUAxNjMuY29tWm9uZ2Jpbg==',
                      token_type: 'bearer',
                      email: email,
                    };
    return of(_token).pipe(
      tap(token => this.token.set(token)),
      map(() => this.check())
    );


  }

  logout() {

    // return this.http.post('/auth/logout', {}).pipe(
    //   tap(() => this.token.clear()),
    //   map(() => !this.check())
    // );

    return of({}).pipe(
      tap(() => this.token.clear()),
      map(() => !this.check())
    );


  }

  user() {
    return this.user$.pipe(share());
  }
}

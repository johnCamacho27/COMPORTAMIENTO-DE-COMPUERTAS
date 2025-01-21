import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TokenService } from '@core';

import { AuthService } from '@core/authentication/auth.service';

import { admin, operador } from '../../core/authentication/interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  constructor(
                private cdr: ChangeDetectorRef,
                private auth: AuthService,
                private token: TokenService
  ) {

    // simulacion de ROL
    let user =  this.token.get().email;
    if (user === 'admin@hidroelectrica.com') {
        this.auth.setUser(admin);
    } else {
        this.auth.setUser(operador);
    }

  }

  ngOnInit() {}
}

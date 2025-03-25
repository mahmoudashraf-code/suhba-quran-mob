import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppService } from './app.service';
import { goToDashboard } from './goToDashboard';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {
  constructor(
    private app: AppService
  ) { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let res = await goToDashboard(this.app);
    if (res == true) {
      return true
    } else {
      this.app.logout();
      return false;
    }
  }
}

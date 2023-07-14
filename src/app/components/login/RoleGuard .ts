import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles']; // inizializzazione di expectedRoles con i ruoli consentiti dalla rotta
    const token = localStorage.getItem('token');
    if (token) {
      const userRole = JSON.parse(token).role;
      if (expectedRoles && !expectedRoles.includes(userRole)) { // verifica della presenza del ruolo dell'utente tra quelli consentiti
        // this.router.navigate(['/unauthorized']);
        alert("Utente NON AUTORIZZATO.");
        return false;
      }
      console.log("Utente autorizzato.")
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'] as string[]; // inizializzazione di expectedRoles con i ruoli consentiti dalla rotta
    const token = localStorage.getItem('token');

    if (token) {
      const tokenParts = token.split('.'); // Dividi il token in tre parti: header, payload e signature
      const tokenPayload = atob(tokenParts[1]); // Decodifica la parte del payload da Base64

      const decodedToken = JSON.parse(tokenPayload);
      const userRole = decodedToken.role;

      if (expectedRoles && !expectedRoles.includes(userRole)) { // verifica della presenza del ruolo dell'utente tra quelli consentiti
        // Utente NON AUTORIZZATO
        alert("Utente non autorizzato.")
        return false;
      }

      // Utente autorizzato
      return true;
    } else {
      // Token non presente, reindirizza alla pagina di login
      this.router.navigate(['/login']);
      return false;
    }
  }
}

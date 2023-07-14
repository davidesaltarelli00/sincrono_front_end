import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'dipendente', password: 'dipendente', role: 'dipendente' },
    { username: 'risorseumane', password: 'risorseumane', role: 'risorseumane' }
  ];

  public userLogged:any;

  login(username: string, password: string): boolean {
    const user = this.users.find(user => user.username === username && user.password === password);
    if (user) {
      const token = { username: user.username, role: user.role };
      localStorage.setItem('token', JSON.stringify(token));
      console.log(token);
      localStorage.setItem('userLogged', username);
      console.log("Utente loggato: " + username);
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
  }


  getUser(){
    localStorage.getItem('userLogged');
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {User} from "../../entity/User";

@Injectable({
  providedIn: 'root',
})
export class UserSharedService {
  // Créez un BehaviorSubject pour gérer l'état de l'utilisateur actif
  private activeUserSubject = new BehaviorSubject<User | null>(null);

  // Exposez l'observable pour d'autres composants
  activeUser$ = this.activeUserSubject.asObservable();

  constructor() {}

  // Méthode pour mettre à jour l'utilisateur actif
  updateActiveUser(user: User) {
    this.activeUserSubject.next(user);
  }

  // Optionnellement, réinitialisez l'état de l'utilisateur actif
  resetActiveUser() {
    this.activeUserSubject.next(null);
  }
}

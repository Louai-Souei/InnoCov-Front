import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { AppSettings } from "../../settings/app-settings";
import { AuthenticationService } from "../auth/authentication/authentication.service";
import {AlertService} from "../utils/alert/alert.service";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private socketUrl: string = AppSettings.API_ENDPOINT + 'ws';

  constructor(private authService: AuthenticationService,
              private alertService: AlertService) {}

  // Connexion WebSocket
  connect(): void {
    if (this.stompClient && this.stompClient.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found, WebSocket connection aborted');
      return;
    }

    let ws = new SockJS(this.socketUrl + `?token=${token}`); // Ajout du token dans l'URL
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect(
      { 'Authorization': 'Bearer ' + this.authService.getToken() },
      (frame: any) => {
        console.log('Connected: ' + frame);


      // Abonnement aux notifications utilisateur
      this.stompClient?.subscribe(`/user/${this.authService.getUserId()}/notifications`, (message: any) => {
        const notification = JSON.parse(message.body);
        if (notification) {
          switch (notification.status) {
            case 'BORROWED':
              this.alertService.info(notification.message, notification.bookTitle);
              break;
            case 'RETURNED':
              this.alertService.warning(notification.message, notification.bookTitle);
              break;
            case 'RETURN_APPROVED':
              this.alertService.success(notification.message, notification.bookTitle);
              break;
            default:
              console.log('Unknown notification status:', notification.status);
          }
        }
      });

      // Abonnement aux messages généraux
      this.stompClient?.subscribe('/topic/messages', (message) => {
        if (message.body) {
          const currentMessages = this.messagesSubject.value;
          this.messagesSubject.next([...currentMessages, JSON.parse(message.body)]);
        }
      });
    }, (error: any) => {
      console.error('Error with WebSocket connection', error);
    });
  }


  // Vérifier si la connexion WebSocket est active
  isConnected(): boolean {
    return this.stompClient?.connected ?? false;
  }

  // Envoi de message via WebSocket
  sendMessage(message: any): void {
    if (this.isConnected()) {
      this.stompClient?.send('app/sendMessage', {}, JSON.stringify(message));
    } else {
      console.error('Cannot send message: No WebSocket connection');
    }
  }

  // Se déconnecter proprement
  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
        // Nettoyer les abonnements et les ressources ici si nécessaire
      });
    }
  }
}

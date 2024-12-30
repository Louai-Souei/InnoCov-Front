import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Stomp from 'stompjs';  // Assurez-vous d'importer correctement Stomp
import SockJS from 'sockjs-client';
import {AppSettings} from "../../settings/app-settings";

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private socketUrl: string = AppSettings.API_ENDPOINT + 'ws';

  // Connexion WebSocket
  connect(): void {
    if (this.stompClient) {
      console.log('WebSocket already connected');
      return;
    }

    const socket = new SockJS(this.socketUrl);
    this.stompClient = Stomp.over(socket);

    // Connexion avec authentification via le token
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      // Vous pouvez ajouter d'autres abonnements ici, par exemple pour écouter les messages
      this.stompClient?.subscribe('/topic/messages', (message) => {
        if (message.body) {
          const currentMessages = this.messagesSubject.value;
          this.messagesSubject.next([...currentMessages, JSON.parse(message.body)]);
        }
      });
    }, (error: any) => {  // Gestion des erreurs de connexion
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
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }
}

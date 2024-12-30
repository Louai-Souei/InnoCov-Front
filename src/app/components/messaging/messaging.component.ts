import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from "../../services/WebSocket/web-socket.service";

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit, OnDestroy {
  message = '';
  messages: any[] = [];

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    // Pas besoin de connecter à nouveau, juste écouter les messages
    this.webSocketService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      const newMessage = {
        sender: 'Current User',
        content: this.message,
        sentAt: new Date(),
      };
      this.webSocketService.sendMessage(newMessage);
      this.message = '';
    }
  }

  ngOnDestroy() {
    // Ne pas déconnecter ici pour garder la connexion active entre différentes vues
    // this.webSocketService.disconnect(); // Si vous souhaitez fermer la connexion, décommentez cette ligne
  }
}

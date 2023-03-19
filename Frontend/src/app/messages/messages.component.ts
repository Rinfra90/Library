import { Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  constructor(
    public messageService: MessageService
  ) { }

  getLastMessages(): string[] {
    if (this.messageService.messages.length >= 5) {
      return this.messageService.messages.slice(this.messageService.messages.length - 5);
    }
    return this.messageService.messages;
  }
}

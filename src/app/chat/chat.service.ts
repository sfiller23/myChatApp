import { Injectable } from '@angular/core';
import { User } from '../users/user.model';
import { Message } from './chat-boxes/messages/message.model';
import { BoxActive } from './chat-boxes/chat-box.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }


}

export interface PsaudoChatBox{
  admin: User;
  contact: User;
  messages: Message[];
  activeSide: BoxActive;
  seen: boolean;
}



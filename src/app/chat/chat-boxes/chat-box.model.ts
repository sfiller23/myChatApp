import { User } from "src/app/users/user.model";
import { Message } from './messages/message.model';

export interface BoxActive{
  admin: {id: string, isActive: boolean},
  contact: {id: string, isActive: boolean}
}

export class ChatBox{
  id: string;
  admin: User;
  contact: User;
  messages: Message[];
  activeSide: BoxActive;
  seen: boolean | undefined;

  constructor(id: string, admin: User, contact: User, messages: Message[], activeSide: BoxActive, seen?: boolean){
    this.id = id;
    this.admin = admin;
    this.contact = contact;
    this.messages = messages;
    this.activeSide = activeSide;
    this.seen = seen;

  }


}

import { User } from "src/app/users/user.model";

export class Message{
  owner: User;
  id: string | undefined;
  content: string | undefined;
  time: Date;
  timeString: string;
  seen: boolean | undefined;
  sent: boolean;

  constructor(owner: User, id?: string, content?: string, seen?: boolean, sent?: boolean){
    this.owner = owner;
    this.id = id;
    this.content = content;
    this.time = new Date();
    this.timeString = this.time.toString();
    this.seen = seen;
    this.sent = sent;
  }


}

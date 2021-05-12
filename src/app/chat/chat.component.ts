import { UsersService } from './../users/users.service';
import { DataUpdateService } from 'src/app/shared/data-update.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, ElementRef, AfterViewChecked, ViewChild, Output, EventEmitter } from '@angular/core';
import * as fromApp from '../store/app.reducer'
import * as ChatActions from './store/chat.actions'
import { User } from '../users/user.model';
import { ChatBox } from './chat-boxes/chat-box.model';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  admin: User = null;
  state: Subscription = new Subscription();
  @Output() onSetMessagesToSeen = new EventEmitter<{currentChatBox: ChatBox}>();
  @ViewChild('messages',{static:true}) messages: ElementRef<HTMLDivElement>;
  @ViewChild('contacts',{static:true}) contacts: ElementRef<HTMLDivElement>;
  messagesYposition: number = 0;
  contactsYposition: number = 0;
  chatBox: ChatBox = null;
  index: number = -1;
  boxes: ChatBox[] = [];
  boxesMessage: string[] = [];
  messageSent: boolean[] = [];
  messageLoading: boolean = false;
  isActive: boolean = false;

  constructor(private usersService: UsersService, private dataUpdateService: DataUpdateService, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {



    this.store.dispatch(
      ChatActions.initChat()
    )

    this.state = this.store.select('chat').subscribe(state=>{
        this.admin = state.admin;

        if(!this.admin){
          this.admin = this.usersService.getCurrentUser();
        }

        if(state.chatBoxes.length === 0){
          this.isActive = false;
        }else{
          this.isActive = false;
          if(this.admin){
            state.chatBoxes.forEach(((box, index)=>{
              if(this.admin.id === box.admin.id){
                if(box.activeSide.admin.isActive){
                  this.isActive = true;
                  this.setCurrentMessage({chatBox: box, index: index, boxes: state.chatBoxes, boxesMessage: this.boxesMessage});
                  if(box.messages[box.messages.length-1].sent){
                    this.messageLoading = false;
                  }
                }
              }else if(this.admin.id === box.contact.id){
                if(box.activeSide.contact.isActive){
                  this.isActive = true;
                  this.setCurrentMessage({chatBox: box, index: index, boxes: state.chatBoxes, boxesMessage: this.boxesMessage});
                  if(box.messages[box.messages.length-1].sent){
                    this.messageLoading = false;
                  }
                }
              }
            })
            )
          }


        }
      }
    )

    this.dataUpdateService.dataUpdate("chatBoxes");
  }

  ngAfterViewChecked(){
    if(this.contacts && this.messages){
      const windowHeight = window.innerHeight.toString();

      this.contacts.nativeElement.style.minHeight = windowHeight+'px';
      this.messages.nativeElement.style.minHeight = windowHeight+'px';

      this.contacts.nativeElement.scrollTop = this.contactsYposition;
      this.messages.nativeElement.scrollTop = this.messagesYposition;

    }


  }


  seen(){

    const currentChatBoxes: ChatBox[] = [...this.boxes];
    const currentBox: ChatBox = this.chatBox;
    const userData = this.usersService.getCurrentUser();

    const lastMessageOwner: User = currentBox.messages[currentBox.messages.length-1].owner;
    if(lastMessageOwner.id !== userData.id){
      this.store.dispatch(
        ChatActions.setToSeen({currentBoxes: currentChatBoxes, currentBox: currentBox})
      )
    }

    this.store.dispatch(
      ChatActions.setTextAreaFocusTrue()
    )

  }



  sendMessage(){
    const currentChatBoxes: ChatBox[] = [...this.boxes];
    const currentBox: ChatBox = this.chatBox;
    const currentText = this.boxesMessage[this.index];
    this.messageLoading = true;
    this.store.dispatch(
      ChatActions.sendMessage({currentBoxes: currentChatBoxes, currentBox: currentBox, messageText: currentText})
    )
    this.boxesMessage[this.index] = '';

  }

  setCurrentMessage(event: {chatBox: ChatBox, index: number, boxes: ChatBox[], boxesMessage: string[]}){
    this.chatBox = event.chatBox;
    this.index = event.index;
    this.boxes = event.boxes;
    this.boxesMessage = event.boxesMessage;
    this.isActive = true;
  }

  onToggle(event: {elementName: string}){
    switch(event.elementName){
      case "contacts":{
        this.messages.nativeElement.style.display = 'none';
        this.contacts.nativeElement.style.display = 'block';
        break;
      }
      case "messages":{
        this.contacts.nativeElement.style.display = 'none';
        this.messages.nativeElement.style.display = 'block';
        break;
      }
      default: {

        break;
     }
    }
  }

  onResize(event: any){
    if(event.target.innerWidth > 458){
      this.contacts.nativeElement.style.display = 'block';
      this.messages.nativeElement.style.display = 'block';
    }else{
      this.messages.nativeElement.style.display = 'none';
    }
  }

  setYposition(el: HTMLDivElement, component: string){
    switch(component) {
      case "messages": {
        this.messagesYposition = el.scrollTop;
         break;
      }
      case "contacts": {
        this.contactsYposition = el.scrollTop;
         break;
      }
      default: {
         break;
      }
   }
  }

  ngOnDestroy(){
    this.state.unsubscribe();
  }

}



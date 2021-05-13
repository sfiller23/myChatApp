import { UsersService } from './../../users/users.service';
import { ChatBox } from './chat-box.model';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChildren, QueryList, AfterViewChecked, Output, EventEmitter} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import * as ChatActions from '../store/chat.actions'
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-chat-boxes',
  templateUrl: './chat-boxes.component.html',
  styleUrls: ['./chat-boxes.component.css']
})
export class ChatBoxesComponent implements OnInit , OnDestroy, AfterViewChecked{
  @Input() admin: User = null;
  @Input() messageSent: boolean[] = [];
  @Input() messageLoading: boolean = false;
   @Output() setMessage = new EventEmitter<{chatBox: ChatBox, index: number, boxes: ChatBox[], boxesMessage: string[]}>();
  @ViewChildren('messageBody') messageBody: QueryList<ElementRef> = new QueryList();
 // @ViewChildren('textArea') textArea: QueryList<ElementRef> = new QueryList();
  chatBoxes: ChatBox[] = [];
  state: Subscription = new Subscription();
  messageText: string = '';
  boxesYposition: number[] = [];
  boxesMessage: string[] = [];
  boxesLoading: boolean[] = [];
  deleteLoader: boolean[] = [];
  deleteLoaderIndex: number = 0;

  constructor(private store: Store<fromApp.AppState>, private usersService: UsersService) {

  }


  ngAfterViewChecked(){

    if(this.messageBody){
      this.messageBody.forEach((item,index)=>{
        item.nativeElement.scrollTop = this.boxesYposition[index];
      })
    }

    // if(this.chatBoxes){
    //   this.chatBoxes.forEach((box,index)=>{
    //     if(box.isActive && this.boxesYposition[index] === 0 || this.boxesYposition[index] === undefined){
    //      // console.log("Message Seen view check");
    //     }
    //   })
    // }


  }


  ngOnInit(): void {

    if(!this.admin){
      this.admin = this.usersService.getCurrentUser();
    }

    this.state = this.store.select('chat').subscribe(state=>{
      if(this.deleteLoader[this.deleteLoaderIndex]){
        this.deleteLoader.fill(false);
      }
      this.chatBoxes = state.chatBoxes;
      if(this.admin){
        this.chatBoxes.forEach((box,index)=>{
          if(this.admin.id === box.admin.id || this.admin.id === box.contact.id){
            if(box.activeSide.admin.isActive || box.activeSide.contact.isActive){
              this.boxesLoading.fill(false);
                if(state.isTextAreaOnFocus){
                  if(this.boxesYposition[index] === 0 || this.boxesYposition[index] === undefined){
                    this.store.dispatch(
                      ChatActions.setMessagesToSeen({currentBox: box})
                    )
                  }
                }
              }
            }
            // else if(this.admin.id === box.contact.id){
            //   if(box.activeSide.contact.isActive){
            //     this.boxesLoading.fill(false);
            //       if(state.isTextAreaOnFocus){
            //         if(this.boxesYposition[index] === 0 || this.boxesYposition[index] === undefined){
            //           this.store.dispatch(
            //             ChatActions.setMessagesToSeen({currentBox: box})
            //           )
            //         }
            //       }
            //     }
            // }

          })
        }
      }
    )


  }


  onSetMessage(chatBox: ChatBox, index: number){

    let isActive: boolean = false;

    if(this.admin){
      if(this.admin.id === chatBox.admin.id){
        isActive = chatBox.activeSide.admin.isActive;
      }else if(this.admin.id === chatBox.contact.id){
        isActive = chatBox.activeSide.contact.isActive;
      }
    }

    if(!isActive){
      this.boxesLoading[index] = true;

      this.store.dispatch(
        ChatActions.activateBox({currentBoxes: this.chatBoxes, currentBox: chatBox})
      )
      this.setMessage.emit({chatBox: chatBox, index: index, boxes: this.chatBoxes, boxesMessage: this.boxesMessage});

    }

  }


deleteBox(index: number, id: string){
  this.deleteLoaderIndex = index;
  this.deleteLoader[index] = true;
  let updatedArray = [...this.chatBoxes];
  updatedArray.splice(index, 1);
  this.store.dispatch(
    ChatActions.deleteBox({updatedBoxes: updatedArray, deleteBoxId: id})
  )
}


setYposition(el: HTMLDivElement, index: number){
  const boxXPosition = el.scrollTop;
  const boxIndex = index;
  this.boxesYposition[boxIndex] = boxXPosition;

}

  ngOnDestroy(){
    this.state.unsubscribe();
  }



}

import { UsersService } from './../../users/users.service';
import { PsaudoChatBox} from './../chat.service';
import { Store } from '@ngrx/store';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { GeneralService } from 'src/app/shared/general.service';
import * as fromApp from '../../store/app.reducer';
import * as ChatActions from './chat.actions';
import { User } from 'src/app/users/user.model';
import { ChatBox, BoxActive } from '../chat-boxes/chat-box.model';
import { Message } from '../chat-boxes/messages/message.model';
import { environment } from 'src/environments/environment.prod';





@Injectable()
export class ChatEffects {

  constructor(private userService: UsersService, private action$: Actions, private http: HttpClient, private generalService: GeneralService, private store: Store<fromApp.AppState>){

  }


  initChat$ = createEffect(() => this.action$.pipe(

    ofType(ChatActions.initChat),
    switchMap(() => {
      return this.http.get(environment.APIaccessPoint+'/chatBoxes.json').pipe(

        map((res)=>{
          let boxesArray: ChatBox[] = this.generalService.apiObjectToArray(res);
          let messagesArray: Message[];

          boxesArray.forEach(box=>{
            messagesArray = this.generalService.apiObjectToArray(box.messages);
            box.messages = messagesArray;
          })

          const userData = this.userService.getCurrentUser();

          if(userData.id){

            let myBoxes: ChatBox[] = [];

            boxesArray.forEach(box=>{

              if(box.admin.id === userData.id || box.contact.id === userData.id){
                myBoxes.push(box);
              }
            })
            return ChatActions.setChatBoxes({chatBoxes: myBoxes});
          }else{
            return {type: 'dummy'}
          }


      }),
      tap(()=>{
        const userData = this.userService.getCurrentUser();
        if(userData.id){

          const admin = new User(userData.id, userData.username, userData.email, userData.password, true);

          this.store.dispatch(
            ChatActions.setAdmin({admin: admin})
          )
        }
      }),
      )
    }
  ),

  )
  );

  openNewChatBox$ = createEffect(() => this.action$.pipe(

    ofType(ChatActions.openNewChatBox),
    switchMap((action) => {

      const activeSide: BoxActive = {
        admin: {id: action.admin.id, isActive: false},
        contact: {id: action.contact.id, isActive: false},
      }

      const psaudoChatBox: PsaudoChatBox = {
        admin: action.admin,
        contact: action.contact,
        messages: [new Message(action.admin,'init','Opend at:',false, true)],
        activeSide: activeSide,
        seen: false,
      }


      return this.http.post<{name: string}>(environment.APIaccessPoint+'/chatBoxes.json', psaudoChatBox).pipe(

        map((res)=>{
          const new_box = new ChatBox(res.name, psaudoChatBox.admin, psaudoChatBox.contact, psaudoChatBox.messages, psaudoChatBox.activeSide, false);
          return ChatActions.addChatBox({chatBox: new_box});
      }),

      )
    }
    ))
  );

  deleteBox$ = createEffect(() => this.action$.pipe(

    ofType(ChatActions.deleteBox),
    map((action)=>{
      const box_id = action.deleteBoxId;
      this.http.delete(environment.APIaccessPoint+'/chatBoxes/'+box_id+'.json').subscribe();
      })

    ), {dispatch: false}
  );

  sendMessage$ = createEffect(() => this.action$.pipe(

    ofType(ChatActions.sendMessage),
    map((action)=>{
        const owner: User = this.userService.getCurrentUser();
        let messageArray = [...action.currentBox.messages];
        const currentMessageText = action.messageText;
        const newMessage: Message = new Message(owner ,action.currentBox.id, currentMessageText, false, false);
        messageArray.push(newMessage);
        const chatBox: ChatBox = action.currentBox;
        const chatBoxesArray = [...action.currentBoxes];
        const index = chatBoxesArray.indexOf(chatBox);
        const updatedBox: ChatBox = new ChatBox(chatBox.id, chatBox.admin, chatBox.contact, messageArray, chatBox.activeSide, false);
        chatBoxesArray[index] = updatedBox;
        this.http.post<{name: string}>(environment.APIaccessPoint+'/chatBoxes/'+chatBox.id+'/messages.json', newMessage).subscribe(
          res=>{
            this.http.patch(environment.APIaccessPoint+'/chatBoxes/'+chatBox.id+'.json', {seen: false}).subscribe(()=>{
              newMessage.sent = true;
              this.http.patch(environment.APIaccessPoint+'/chatBoxes/'+chatBox.id+'/messages/'+res.name+'.json', newMessage).subscribe(
                ()=>{
                  chatBoxesArray.forEach(box=>{
                    if(box.id === chatBox.id){
                      box.messages.forEach(message=>{
                        if(message.id === res.name){
                          message.sent = true;
                        }
                      })
                    }
                  })
                }
              )
            });
          }
        );
      })

    ), {dispatch: false}
  );

  setToSeen$ = createEffect(() => this.action$.pipe(

    ofType(ChatActions.setToSeen),
    map((action)=>{
      const chaBoxId = action.currentBox.id;
      const chatBox: ChatBox = action.currentBox;
      const chatBoxesArray = [...action.currentBoxes];
      const index = chatBoxesArray.indexOf(chatBox);
      const updatedBox: ChatBox = new ChatBox(chatBox.id, chatBox.admin, chatBox.contact, chatBox.messages, chatBox.activeSide, true);
      chatBoxesArray[index] = updatedBox;
      this.http.patch(environment.APIaccessPoint+'/chatBoxes/'+chaBoxId+'.json', {seen: true}).subscribe(res=>{
        return ChatActions.setChatBoxes({chatBoxes: chatBoxesArray});
      });

    })
    ), {dispatch: false}
  )


  activateBox$ = createEffect(() => this.action$.pipe(

    ofType(ChatActions.activateBox),
    map((action)=>{

        const chatBoxesArray: ChatBox[] = [...action.currentBoxes];
        let updatedBoxes: ChatBox[] = [];
        let updatedBox: ChatBox = null;
        const currrentUser = this.userService.getCurrentUser();

        let boxActiveSide: BoxActive = {
          admin: {id:'', isActive:false},
          contact: {id:'', isActive :false},
        }

        chatBoxesArray.forEach((box)=>{
          if(box.id === action.currentBox.id){
            updatedBox = new ChatBox(box.id, box.admin, box.contact, box.messages, boxActiveSide, box.seen);
            if(currrentUser.id === box.admin.id){
              updatedBox.activeSide.admin.id = box.admin.id;
              updatedBox.activeSide.contact.id = box.contact.id;
              updatedBox.activeSide.admin.isActive = true;
              updatedBox.activeSide.contact.isActive = box.activeSide.contact.isActive;
            }else if(currrentUser.id === box.contact.id){
              updatedBox.activeSide.admin.id = box.contact.id;
              updatedBox.activeSide.contact.id = box.admin.id;
              updatedBox.activeSide.admin.isActive = box.activeSide.admin.isActive;
              updatedBox.activeSide.contact.isActive = true;
            }
          }else{
            updatedBox = new ChatBox(box.id, box.admin, box.contact, box.messages, boxActiveSide, box.seen);
            if(currrentUser.id === box.admin.id){
              updatedBox.activeSide.admin.id = box.admin.id;
              updatedBox.activeSide.contact.id = box.contact.id;
              updatedBox.activeSide.admin.isActive = false;
              updatedBox.activeSide.contact.isActive = box.activeSide.contact.isActive;
            }else if(currrentUser.id === box.contact.id){
              updatedBox.activeSide.admin.id = box.contact.id;
              updatedBox.activeSide.contact.id = box.admin.id;
              updatedBox.activeSide.admin.isActive = box.activeSide.admin.isActive;
              updatedBox.activeSide.contact.isActive = false;
            }
          }
          updatedBoxes.push(updatedBox);
          this.http.patch(environment.APIaccessPoint+'/chatBoxes/'+box.id+'.json', updatedBox).subscribe(
            res=>{
              return ChatActions.setChatBoxes({chatBoxes: updatedBoxes});
            }
          );
        })

      }),


    ), {dispatch: false}
  );

  setMessagesToSeen$ = createEffect(() => this.action$.pipe(

    ofType(ChatActions.setMessagesToSeen),
    map((action)=>{
      const chaBox = action.currentBox;
      const admin = this.userService.getCurrentUser();
      chaBox.messages.forEach(message=>{
        if(admin.id !== message.owner.id){
          this.http.patch(environment.APIaccessPoint+'/chatBoxes/'+chaBox.id+'/messages/'+message.id+'.json', {seen: true}).subscribe();
        }
      })

     return ChatActions.setTextAreaFocusFalse();
    })
    )
  )

}

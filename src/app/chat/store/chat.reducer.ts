import { ChatBox } from './../chat-boxes/chat-box.model';
import { Action, createReducer, on } from "@ngrx/store";
import * as ChatActions from './chat.actions';
import { User } from 'src/app/users/user.model';



export interface State{
  admin: User;
  chatBoxes: ChatBox[];
  isActive: boolean;
  isTextAreaOnFocus: boolean;

}

const initialState: State = {
  admin: new User(),
  chatBoxes: [],
  isActive: false,
  isTextAreaOnFocus: false,

}

const _chatReducer = createReducer(

  initialState,

  on(
    ChatActions.setAdmin,
    (state, action) => (

      {
      ...state,
      admin: action.admin
    })
  ),

  on(
    ChatActions.setChatBoxes,
    (state, action) => (

      {
      ...state,
      chatBoxes: [...action.chatBoxes]
    })
  ),

  on(
    ChatActions.addChatBox,
    (state, action) => (

      {
      ...state,
      chatBoxes: [...state.chatBoxes, action.chatBox]
    })
  ),

  on(
    ChatActions.updateChatBoxes,
    (state, action) => (
      {
      ...state,
      chatBoxes: [...action.currentBoxes]

    })
  ),

  on(
    ChatActions.setTextAreaFocusTrue,
    (state) => (
      {
      ...state,
      isTextAreaOnFocus: true

    })
  ),

  on(
    ChatActions.setTextAreaFocusFalse,
    (state) => (
      {
      ...state,
      isTextAreaOnFocus: false

    })
  ),




)

export function chatReducer(state: State = initialState, action:Action) {
  return _chatReducer(state, action);
};


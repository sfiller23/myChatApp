import { ChatBox } from './../chat-boxes/chat-box.model';
import { createAction, props } from "@ngrx/store";
import { User } from "src/app/users/user.model";


export const initChat = createAction(
  '[Chat] InitChat',

);

export const setChatBoxes = createAction(
  '[Chat] SetChatBoxes',

  props<{
    chatBoxes: ChatBox[];
  }>()
);

export const setAdmin = createAction(
  '[Chat] SetAdmin',

  props<{
    admin: User;
  }>()
);

export const addChatBox = createAction(
  '[Chat] AddChatBox',

  props<{
    chatBox: ChatBox;
  }>()
);

export const openNewChatBox = createAction(
  '[Chat] OpenNewChatBox',

  props<{
    admin: User,
    contact: User
  }>()
);

export const deleteBox = createAction(
  '[Chat] DeleteBox',

  props<{
    updatedBoxes: ChatBox[],
    deleteBoxId: string
  }>()
);

export const sendMessage = createAction(
  '[Chat] SendMessage',

  props<{
    currentBoxes: ChatBox[],
    currentBox: ChatBox,
    messageText: string,
  }>()
);

export const setToSeen = createAction(
  '[Chat] SetToSeen',

  props<{
    currentBoxes: ChatBox[],
    currentBox: ChatBox,
  }>()
);

export const setMessagesToSeen = createAction(
  '[Chat] SetMessagesToSeen',

  props<{
    currentBox: ChatBox
  }>()
);


export const updateChatBoxes = createAction(
  '[Chat] UpdateChatBoxes',

  props<{
    currentBoxes: ChatBox[],
  }>()
);

export const activateBox = createAction(
  '[Chat] ActivateBox',

  props<{
    currentBoxes: ChatBox[],
    currentBox: ChatBox,
  }>()
);

export const setTextAreaFocusFalse = createAction(
  '[Chat] SetTextAreaFocusFalse',
);

export const setTextAreaFocusTrue = createAction(
  '[Chat] SetTextAreaFocusTrue',
);












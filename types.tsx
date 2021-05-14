/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  ChatRoom: undefined;
  Contacts: undefined;
  UserContacts: undefined;
};

export type BottomTabParamList = {
  Contacts: undefined;
  Chats: undefined;

};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;

};

export type User = {
  id: String;
  name: String;
  imageUri: String;
  status: String;
}

export type Message = {
  id: String;
  content: string;
  createdAt: string;
  user: User;

}
// Тип пользователя задаем массивом для возможной интеграции групп или бесед
export type ChatRoom = {
  id: String;
  users: User[];
  lastMessage: Message;

}

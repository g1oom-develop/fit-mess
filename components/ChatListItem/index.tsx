import moment from "moment";
import React, {useEffect, useState} from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { ChatRoom } from "../../types";
import styles from "./style";
import { useNavigation } from '@react-navigation/native';
import {
    Auth,
  } from 'aws-amplify';
/*function Example() {
  const [count, setCount] = useState(0);

  // Похож на componentDidMount и componentDidUpdate:
  useEffect(() => {
    // Обновляем название докуммента, используя API браузера
    document.title = `Вы нажали ${count} раз`;
  });

  return (
    <div>
      <p>Вы нажали {count} раз</p>
      <button onClick={() => setCount(count + 1)}>
        Нажми меня
      </button>
    </div>
  );
}*/
export type ChatListItemProps = {
    chatRoom: ChatRoom;
}

const ChatListItem = (props: ChatListItemProps) => {
    const { chatRoom } = props;
    const [ drugieUser, setDrugieUser] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
    //Вывод пользователей в список активных чатов
      const getDrugieUser = async () => {
        const userInfo = await Auth.currentAuthenticatedUser();
        // Проверка на одинакового пользователя, если айдишники идентичны, то вывод второго пользователя
        if (chatRoom.chatRoomUsers.items[0].user.id === userInfo.attributes.sub) {
          setDrugieUser(chatRoom.chatRoomUsers.items[1].user);
        } else {
          setDrugieUser(chatRoom.chatRoomUsers.items[0].user);
        }
      }
      // Сохранение в массив
      getDrugieUser();
    }, [])
    // Функция вывода списка чатов через навигейт
    const onClick = () => {
        navigation.navigate('ChatRoom', {
            id: chatRoom.id,
            name: drugieUser.name,
        })
    }
    // Решение ошибки с возвратом нулевого значения, краткое условие 
    if (!drugieUser) {
      return null;
    }
    
    return (
      // Кликабельный контейнер + общий вид
      <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Image source={{ uri: drugieUser.imageUri }} style={styles.avatar}/>

          <View style={styles.midContainer}>
          <Text style={styles.username}>{drugieUser.name}</Text>
          <Text
              numberOfLines={2}
              style={styles.lastMessage}>
              {chatRoom.lastMessage
                ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content}`
                : ""}
            </Text>          
            </View>

        </View>

        <Text style={styles.time}>
        {chatRoom.lastMessage && moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
        </Text>
      </View>
    </TouchableWithoutFeedback>
      
    )
};

export default ChatListItem;

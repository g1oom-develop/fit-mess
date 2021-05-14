import * as React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import { View } from '../components/Themed';
import ChatListItem from '../components/ChatListItem';
import {
  API,
  graphqlOperation,
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

// Импорт Хуков
import {useEffect, useState} from "react";
// Импорт консольной операции получения пользователя из кастомного скрина
import { getUser } from './queries';

export default function ChatsScreen() {
// Инициализация хука с пустым массивом
 const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    // Объявляем новую переменную состояния fetchChatRooms
    const fetchChatRooms = async () => {
      try {
        // Просмотр информации авторизированного пользователя
        const userInfo = await Auth.currentAuthenticatedUser();

        const userData = await API.graphql(
          graphqlOperation(
            getUser, {
              id: userInfo.attributes.sub,
            }
          )
        )

       setChatRooms(userData.data.getUser.chatRoomUser.items)

      } catch (e) {
        console.log(e);
      }
    }
    // Добавление в массив информации об чат комнатах
    fetchChatRooms();
  }, []);

  return (
    // Стандартный лист 
    <View style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        data={chatRooms}
        renderItem={({ item }) => <ChatListItem chatRoom={item.chatRoom} />}
        keyExtractor={(item) => item.id}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});

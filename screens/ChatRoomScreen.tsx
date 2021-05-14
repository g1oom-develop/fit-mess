import React, {useEffect, useState} from 'react';
import {FlatList, Text, ImageBackground, KeyboardAvoidingView } from 'react-native';

import { useRoute } from '@react-navigation/native';

import ChatMessage from '../components/ChatMessage';
import BG from '../assets/images/bg.jpg';
import TextBox from '../components/TextBox';
import {
    API,
    graphqlOperation,
    Auth,
  } from 'aws-amplify';
  
  import { messagesByChatRoom } from '../src/graphql/queries';
  import { onCreateMessage } from '../src/graphql/subscriptions';
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

// Инициализация атрибутов
const ChatRoomScreen = () => {
    const [messages, setMessages] = useState([]);
    const [myId, setMyId] = useState(null);
    const route = useRoute();
// Вызов сообщений 
    const fetchMessages = async () => {
      const messagesData = await API.graphql(
        graphqlOperation(
          messagesByChatRoom, {
            chatRoomID: route.params.id,
            sortDirection: "DESC",
            //изменение порядка вывода
          }
        )
      )
      console.log("Получение сообщений")
      setMessages(messagesData.data.messagesByChatRoom.items);
    }
  // useEffect вызывается тогда, когда код готов для дальнейшей работы, сохранение массива
    useEffect(() => {
    fetchMessages();
  }, [])
  // Инициализация атрибутов зарегестрированного пользователя, сохранение в массив 
  useEffect(() => {
    const getMyId = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyId(userInfo.attributes.sub);
    }
    getMyId();
  }, [])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage;
        if (newMessage.chatRoomID !== route.params.id) {
          console.log("Сообщение недошло")
          return;
        }

        fetchMessages();
      }
    });

    return () => subscription.unsubscribe();
  }, [])

  console.log(`сообщение находиться: ${messages.length}`)
  
    return (
        <ImageBackground style={{width: '100%', height: '100%'}} source={BG}>
            <FlatList
              data={messages}
              renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}                
              inverted
            />

            <TextBox chatRoomID={route.params.id}/>
        </ImageBackground>
 
    );
}

export default ChatRoomScreen;
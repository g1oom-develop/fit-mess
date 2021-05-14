import moment from 'moment';
import React from 'react';
import { Text, View } from "react-native";
import { Message } from '../../types';
import styles from './style';
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
// Настройка типов атрибутов
export type ChatMessageProps = {
    message: Message;
    myId: String,
}
// Возвращеаем знаечние атрибутов
const ChatMessage = (props: ChatMessageProps) => {
    const { message, myId } = props;
// Добавление новой функции для решиния проблемы с видом сообщений, необходимо разделить сообщения мэин пользователя от собеседника
    const isMyMessage = () => {
        return message.user.id === myId;    
    }
// Проверка если мое сообщение то голубой иначе белый, тоже самое с расстановкой 
    return(
        <View style={styles.container}>
            <View style={[
                styles.messageBox, {
                    backgroundColor: isMyMessage() ? '#9BE3FF' : '#fff',
                    marginLeft: isMyMessage() ? 50 : 0,
                    marginRight: isMyMessage() ? 0 : 50,
                }
                ]}> 
                <Text style={styles.message}>{message.content}</Text>
                <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text>
            </View>
        </View>

        
    )

}

export default ChatMessage;

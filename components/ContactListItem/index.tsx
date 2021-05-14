import React from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import { User } from "../../types";
import styles from "./style";
import { useNavigation } from '@react-navigation/native';
import {
    API,
    graphqlOperation,
    Auth,
  } from "aws-amplify";
  import {
    createChatRoom,
    createChatRoomUser
  } from '../../src/graphql/mutations';


export type ContactListItemProps = {
    user: User;
}

const ContactListItem = (props: ContactListItemProps) => {
    const { user } = props;
// функция навигатора 
    const navigation = useNavigation();


    const onClick = async () => {
      try {
  
        //  1. Создание новой чат комноты
        const newChatRoomData = await API.graphql(
          graphqlOperation(
            createChatRoom, {
              input: {
                lastMessageID: "d25b4a98-689d-457a-a643-fa4ee586fc75"
                //Последнее сообщение мэин пользователя
              }
            }
          )
        )
        console.log(newChatRoomData)
        if (!newChatRoomData.data) {
          console.log("Неполучилось нефортануло");
          return;
        }
  
        const newChatRoom = newChatRoomData.data.createChatRoom;
  
        // 2. Добавление пользователя в чат
        await API.graphql(
          graphqlOperation(
            createChatRoomUser, {
              input: {
                userID: user.id,
                chatRoomID: newChatRoom.id,
              }
            }
          )
        )
  
        //  3. Добавление мэин пользователя в чат
        const userInfo = await Auth.currentAuthenticatedUser();
        await API.graphql(
          graphqlOperation(
            createChatRoomUser, {
              input: {
                userID: userInfo.attributes.sub,
                chatRoomID: newChatRoom.id,
              }
            }
          )
        )
  
        navigation.navigate('ChatRoom', {
          id: newChatRoom.id,
          name: "Новое сообщение",
        })
  
      } catch (e) {
        console.log(e);
      }
    }
    return (
        <TouchableWithoutFeedback onPress={onClick}>
            <View style={styles.container}>
            <View style={styles.leftContainer}>
                
            {/* попытка через дату <Image source={images} style={styles.avatar}></Image>*/}
            <Image source={{uri: user.imageUri}} style={styles.avatar}></Image>

            <View style={styles.midContainer}>
                <Text style={styles.username}>{user.name}</Text>
                <Text numberOfLines={2} style={styles.status}>{user.status}</Text>
            </View>  
            </View>
        </View>
        </TouchableWithoutFeedback>
        
    )
};

export default ContactListItem;

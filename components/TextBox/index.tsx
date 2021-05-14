import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,} from "react-native";
import styles from './styles';
import { Ionicons, FontAwesome5, Foundation, MaterialCommunityIcons, Feather } from '@expo/vector-icons'; 
import {
    API,
    Auth,
    graphqlOperation,
  } from 'aws-amplify';
  
  import {
    createMessage,
    updateChatRoom,
  } from '../../src/graphql/mutations';

  const TextBox = (props) => {

    const { chatRoomID } = props;

    const [message, setMessage] = useState('');
    const [myUserId, setMyUserId] = useState(null);
    /*useEffect(() => {
      const fetchUser = async () => {
        const userInfo = await Auth.currentAuthenticatedUser();
        setMyUserId(userInfo.attributes.sub);
      }
      fetchUser();
    }, [])*/
    useEffect(() => {
      const fetchUser = async () => {
        const userInfo = await Auth.currentAuthenticatedUser();
        setMyUserId(userInfo.attributes.sub);
      }
      fetchUser();
    }, [])
    const onMicroPress = () => {
        console.warn('Microphone')
    }

        //Отправка сообщения в бд
        const updateChatRoomLastMessage = async (messageId: string) => {
          try {
            await API.graphql(
              graphqlOperation(
                updateChatRoom, {
                  input: {
                    id: chatRoomID,
                    lastMessageID: messageId,
                  }
                }
              )
            );
          } catch (e) {
            console.log(e);
          }
        }
        //отправка сообщения на экран
        const onSendPress = async () => {
          try {
            const newMessageData = await API.graphql(
              graphqlOperation(
                createMessage, {
                  input: {
                    content: message,
                    userID: myUserId,
                    chatRoomID
                  }
                }
              )
            )
            await updateChatRoomLastMessage(newMessageData.data.createMessage.id)
              } catch (e) {
                console.log(e);
              }
        setMessage('');
        }

    const onPress = () => {
        if (!message) {
            onMicroPress();
        } else {
            onSendPress();
        }
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={{width: '100%'}}>
      <View style={styles.container}>
          
        <View style={styles.mainBox}>
            <FontAwesome5 name="smile" size={24} color="#AAAAAA" style={styles.smile}/>
            <TextInput 
              placeholder={"Введите сообщение"}
              style={styles.textInput} 
              multiline 
              value={message}
              onChangeText={setMessage}/>
            <Foundation name="paperclip" size={28} color="#AAAAAA" style={styles.icon}/>
              {!message && <Feather name="camera" size={24} color="#AAAAAA" style={styles.icon}/>}
            <TouchableOpacity onPress={onPress}>
              {!message 
                ? <MaterialCommunityIcons name="microphone" size={28} color="#3E97D1" style={styles.btn}/>
                : <Ionicons name="send" size={28} color="#3E97D1" style={styles.btn}/> }
            </TouchableOpacity>
        </View>
            
        </View>
    </KeyboardAvoidingView>
        
    )
}

export default TextBox;
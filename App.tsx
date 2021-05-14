import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import {
  Auth,
  API,
  graphqlOperation,
} from 'aws-amplify';
import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';
// Подключение формы регистрации
import { withAuthenticator } from 'aws-amplify-react-native'
import Amplify from 'aws-amplify'
import config from './aws-exports'
import AvatarImage from './assets/images/User.jpg'
Amplify.configure(config)


function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();


  // Запуск хука при первом включении 
  useEffect( () => {
  // Получение пользователя проверка на аунтентификацию
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });
// Провекра и вывод пользователя 
      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(
            getUser,
            { id: userInfo.attributes.sub }
            )
        )

        if (userData.data.getUser) {
          console.log("Пользователь уже зарегестрирован");
          return;
        }

        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: AvatarImage,
          status: 'vidno vrode',
        }

        await API.graphql(
          graphqlOperation(
            createUser,
            { input: newUser }
          )
        )
      }
    }
// Сохранение в массив
    fetchUser();
  }, []);
// Не дай бог, решение бага
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App)

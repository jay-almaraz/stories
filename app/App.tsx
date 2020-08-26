import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { DrawerMain } from './components/navigation/DrawerMain';
import { SignInScreen } from './components/screens/SignIn';

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#fa974d',
    text: '#202020',
    background: '#fff',
  },
};

export type RootStackRoutes = {
  signIn: undefined;
  drawer: {
    userName?: string;
    cityName: string;
    shiftName: string;
  };
};

const Stack = createStackNavigator<RootStackRoutes>();

export const App: React.FC = (): ReactElement => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='signIn'>
          <Stack.Screen name='signIn' component={SignInScreen} options={{ title: 'Sign In' }} />
          <Stack.Screen name='drawer' component={DrawerMain} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import 'react-native-gesture-handler';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { DrawerContent } from './components/navigation/DrawerContent';
import { HomeScreen } from './components/screens/HomeScreen';
import { OtherScreen } from './components/screens/OtherScreen';
import { RecordScreen } from './components/screens/RecordScreen';

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#fa974d',
    primaryTransparent: '#fa974d33',
    primaryText: '#404040',
    text: '#404040',
  },
};

export type RootNavigatorRoutes = {
  home: undefined;
  other: { msg: string };
  record: undefined;
};
const Drawer = createDrawerNavigator<RootNavigatorRoutes>();

export const App: React.FC = (): ReactElement => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName='home'
          drawerContent={(props) => <DrawerContent {...props} />}
          drawerContentOptions={{
            activeBackgroundColor: theme.colors.primaryTransparent,
            activeTintColor: theme.colors.primaryText,
            inactiveTintColor: theme.colors.primaryText,
            labelStyle: {
              fontSize: 20,
              fontWeight: 'bold',
            },
          }}
        >
          <Drawer.Screen
            name='home'
            component={HomeScreen}
            options={{ title: 'Home', drawerIcon: () => <Icon name='home' size={24} /> }}
          />
          <Drawer.Screen
            name='other'
            component={OtherScreen}
            options={{ title: 'Other' }}
            initialParams={{ msg: 'OKAY I GUESS' }}
          />
          <Drawer.Screen name='record' component={RecordScreen} options={{ title: 'Record' }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

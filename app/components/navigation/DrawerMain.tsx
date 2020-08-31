import { createDrawerNavigator } from '@react-navigation/drawer';
import { StackScreenProps } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { RootStackRoutes } from '../../App';
import { UserProvider } from '../contexts/user/UserContext';
import { HomeScreen } from '../screens/drawer/home/HomeScreen';
import { ListenMain } from '../screens/drawer/listen/ListenMain';
import { ShareMain } from '../screens/drawer/share/ShareMain';
import { DrawerContent } from './DrawerContent';

export type DrawerRoutes = {
  home: undefined;
  listen: undefined;
  share: undefined;
};
const Drawer = createDrawerNavigator<DrawerRoutes>();

type DrawerMainProps = StackScreenProps<RootStackRoutes, 'drawer'>;
export const DrawerMain: React.FC<DrawerMainProps> = (props): ReactElement => {
  const {
    route: { params: user },
  } = props;

  const theme = useTheme();

  return (
    <UserProvider {...user}>
      <Drawer.Navigator
        initialRouteName='home'
        drawerContent={(props) => <DrawerContent {...props} />}
        drawerContentOptions={{
          activeBackgroundColor: `${theme.colors.primary}33`,
          activeTintColor: theme.colors.text,
          inactiveTintColor: theme.colors.text,
          labelStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
          },
        }}
      >
        <Drawer.Screen
          name='home'
          component={HomeScreen}
          options={{ title: 'Home', drawerIcon: () => <Icon name='home' size={24} color={theme.colors.text} /> }}
        />
        <Drawer.Screen
          name='share'
          component={ShareMain}
          options={{
            title: 'Share',
            drawerIcon: () => <Icon name='microphone' size={24} color={theme.colors.text} />,
          }}
        />
        <Drawer.Screen
          name='listen'
          component={ListenMain}
          options={{
            title: 'Listen',
            drawerIcon: () => <Icon name='headphones' size={24} color={theme.colors.text} />,
          }}
        />
      </Drawer.Navigator>
    </UserProvider>
  );
};

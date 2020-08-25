import { createDrawerNavigator } from '@react-navigation/drawer';
import { StackScreenProps } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { RootStackRoutes } from '../../App';
import { HomeScreen } from '../screens/drawer/home/HomeScreen';
import { ListenScreen } from '../screens/drawer/listen/ListenScreen';
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
    route: { params },
  } = props;
  console.log(params);

  const theme = useTheme();

  return (
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
        },
      }}
    >
      <Drawer.Screen
        name='home'
        component={HomeScreen}
        options={{ title: 'Home', drawerIcon: () => <Icon name='home' size={24} /> }}
      />
      <Drawer.Screen
        name='share'
        component={ShareMain}
        options={{
          title: 'Share',
          drawerIcon: () => <Icon name='microphone' size={24} />,
        }}
      />
      <Drawer.Screen
        name='listen'
        component={ListenScreen}
        options={{
          title: 'Listen',
          drawerIcon: () => <Icon name='headphones' size={24} />,
        }}
      />
    </Drawer.Navigator>
  );
};

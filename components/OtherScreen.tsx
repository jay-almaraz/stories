import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { ReactElement } from 'react';
import { Button, Text } from 'react-native-paper';

import { RootNavigatorRoutes } from '../App';
import { Screen } from './core/Screen';

type OtherScreenProps = DrawerScreenProps<RootNavigatorRoutes, 'other'>;
export const OtherScreen: React.FC<OtherScreenProps> = (props): ReactElement => {
  const { navigation, route } = props;

  return (
    <Screen title='Other' drawerHelpers={navigation}>
      <Text>{route.params.msg}</Text>
      <Button onPress={() => navigation.navigate('home')}>HOME</Button>
      <Button onPress={() => navigation.openDrawer()}>DRAWER</Button>
    </Screen>
  );
};

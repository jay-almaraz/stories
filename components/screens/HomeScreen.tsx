import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { ReactElement } from 'react';

import { RootNavigatorRoutes } from '../../App';
import { Screen } from '../core/Screen';

type HomeScreenProps = DrawerScreenProps<RootNavigatorRoutes, 'home'>;
export const HomeScreen: React.FC<HomeScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  return <Screen title='Home' drawerHelpers={navigation} />;
};

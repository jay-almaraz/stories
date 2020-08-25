import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { ReactElement } from 'react';

import { Screen } from '../../../core/Screen';
import { DrawerRoutes } from '../../../navigation/DrawerMain';

type HomeScreenProps = DrawerScreenProps<DrawerRoutes, 'home'>;
export const HomeScreen: React.FC<HomeScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  return <Screen title='Home' drawerHelpers={navigation} />;
};

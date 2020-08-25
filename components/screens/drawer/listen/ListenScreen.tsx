import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { ReactElement } from 'react';

import { Screen } from '../../../core/Screen';
import { DrawerRoutes } from '../../../navigation/DrawerMain';

type ListenScreenProps = DrawerScreenProps<DrawerRoutes, 'listen'>;
export const ListenScreen: React.FC<ListenScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  return <Screen title='Listen' drawerHelpers={navigation} />;
};

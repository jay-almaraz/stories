import { DrawerScreenProps } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React, { ReactElement } from 'react';

import { DrawerRoutes } from '../../../navigation/DrawerMain';
import { CategoriesScreen } from './CategoriesScreen';
import { RecordScreen } from './RecordScreen';

export type ShareStackRoutes = {
  categories: undefined;
  record: undefined;
};

const Stack = createStackNavigator<ShareStackRoutes>();

type ShareMainProps = DrawerScreenProps<DrawerRoutes, 'share'>;
export const ShareMain: React.FC<ShareMainProps> = (): ReactElement => {
  return (
    <Stack.Navigator initialRouteName='categories'>
      <Stack.Screen name='categories' component={CategoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name='record' component={RecordScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

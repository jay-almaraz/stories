/**
 * Routing for the share functionality of the app
 */

import { DrawerScreenProps } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { FileInfo } from 'expo-file-system';
import React, { ReactElement } from 'react';

import { DrawerRoutes } from '../../../navigation/DrawerMain';
import { CategoriesScreen } from './CategoriesScreen';
import { RecordScreen } from './RecordScreen';
import { ShareScreen } from './ShareScreen';
import { ThanksScreen } from './ThanksScreen';

export type ShareStackRoutes = {
  categories: undefined;
  record: {
    categoryName: string;
  };
  share: {
    categoryName: string;
    file: FileInfo;
    recordingDuration: string;
  };
  thanks: undefined;
};

const Stack = createStackNavigator<ShareStackRoutes>();

type ShareMainProps = DrawerScreenProps<DrawerRoutes, 'share'>;
export const ShareMain: React.FC<ShareMainProps> = (): ReactElement => {
  return (
    <Stack.Navigator initialRouteName='categories'>
      <Stack.Screen name='categories' component={CategoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name='record' component={RecordScreen} options={{ headerShown: false }} />
      <Stack.Screen name='share' component={ShareScreen} options={{ headerShown: false }} />
      <Stack.Screen name='thanks' component={ThanksScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

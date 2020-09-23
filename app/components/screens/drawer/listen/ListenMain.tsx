/**
 * Routing for the listen functionality of the app
 */

import { DrawerScreenProps } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React, { ReactElement } from 'react';

import { DrawerRoutes } from '../../../navigation/DrawerMain';
import { BrowseScreen } from './BrowseScreen';
import { StoryScreen } from './StoryScreen';

export type ListenStackRoutes = {
  browse: undefined;
  story: {
    storyId: string;
  };
};

const Stack = createStackNavigator<ListenStackRoutes>();

type ListenMainProps = DrawerScreenProps<DrawerRoutes, 'listen'>;
export const ListenMain: React.FC<ListenMainProps> = (): ReactElement => {
  return (
    <Stack.Navigator initialRouteName='browse'>
      <Stack.Screen name='browse' component={BrowseScreen} options={{ headerShown: false }} />
      <Stack.Screen name='story' component={StoryScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

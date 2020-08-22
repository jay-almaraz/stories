import { DrawerActionHelpers } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

import { RootNavigatorRoutes } from '../../App';

interface ScreenProps {
  onGoBack?: () => void;
  title: string;
  subtitle?: string;
  drawerHelpers: DrawerActionHelpers<RootNavigatorRoutes>;
}
export const Screen: React.FC<ScreenProps> = (props): ReactElement => {
  const { onGoBack, title, subtitle, drawerHelpers, children } = props;

  return (
    <View>
      <Appbar.Header>
        <Appbar.Action icon='menu' onPress={() => drawerHelpers.openDrawer()} />
        {onGoBack ? <Appbar.BackAction onPress={onGoBack} /> : null}
        <Appbar.Content title={title} subtitle={subtitle} />
      </Appbar.Header>
      {children}
    </View>
  );
};

import { DrawerActionHelpers } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { Dimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Appbar, useTheme } from 'react-native-paper';

import { DrawerRoutes } from '../navigation/DrawerMain';

interface ScreenProps {
  onGoBack?: () => void;
  title: string;
  subtitle?: string;
  drawerHelpers: DrawerActionHelpers<DrawerRoutes>;
}
export const Screen: React.FC<ScreenProps> = (props): ReactElement => {
  const { onGoBack, title, subtitle, drawerHelpers, children } = props;

  const theme = useTheme();
  const { height } = Dimensions.get('window');

  return (
    <View
      style={{
        height,
        width: '100%',
      }}
    >
      <Appbar.Header>
        <Appbar.Action color={theme.colors.text} icon='menu' onPress={() => drawerHelpers.openDrawer()} />
        {onGoBack ? <Appbar.BackAction onPress={onGoBack} /> : null}
        <Appbar.Content
          titleStyle={{ color: theme.colors.text }}
          subtitleStyle={{ color: theme.colors.text }}
          title={title}
          subtitle={subtitle}
        />
      </Appbar.Header>
      {children}
    </View>
  );
};

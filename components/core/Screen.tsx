import { DrawerActionHelpers } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

import { DrawerRoutes } from '../navigation/DrawerMain';

const { height: DEVICE_HEIGHT } = Dimensions.get('window');

interface ScreenProps {
  onGoBack?: () => void;
  title: string;
  subtitle?: string;
  drawerHelpers: DrawerActionHelpers<DrawerRoutes>;
}
export const Screen: React.FC<ScreenProps> = (props): ReactElement => {
  const { onGoBack, title, subtitle, drawerHelpers, children } = props;

  const theme = useTheme();

  return (
    <View style={styles.mainView}>
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

const styles = StyleSheet.create({
  mainView: {
    height: DEVICE_HEIGHT,
    width: '100%',
  },
});

import { DrawerActionHelpers } from '@react-navigation/native';
import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

import { DrawerRoutes } from '../navigation/DrawerMain';

interface ScreenProps {
  onGoBack?: () => void;
  title: string;
  subtitle?: string;
  drawerHelpers: DrawerActionHelpers<DrawerRoutes>;
}
export const Screen: React.FC<ScreenProps> = (props): ReactElement => {
  const { onGoBack, title, subtitle, drawerHelpers, children } = props;

  return (
    <View style={styles.mainView}>
      <Appbar.Header>
        <Appbar.Action icon='menu' onPress={() => drawerHelpers.openDrawer()} />
        {onGoBack ? <Appbar.BackAction onPress={onGoBack} /> : null}
        <Appbar.Content title={title} subtitle={subtitle} />
      </Appbar.Header>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
  },
});

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import * as Updates from 'expo-updates';
import React, { ReactElement } from 'react';
import { Image, ImageRequireSource, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

export const DrawerContent: React.FC<DrawerContentComponentProps> = (props): ReactElement => {
  const theme = useTheme();

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../../assets/img/os/wordmark.png') as ImageRequireSource}
          style={{
            width: '60%',
            height: undefined,
            aspectRatio: 533 / 303,
            marginTop: 50,
            marginBottom: 50,
          }}
        />
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label='Logout'
        onPress={async () => await Updates.reloadAsync()}
        activeBackgroundColor={`${theme.colors.primary}33`}
        activeTintColor={theme.colors.text}
        inactiveTintColor={theme.colors.text}
        labelStyle={{
          fontSize: 20,
          fontWeight: 'bold',
          color: theme.colors.text,
        }}
        icon={() => <Icon name='arrow-left' size={24} color={theme.colors.text} />}
      />
    </DrawerContentScrollView>
  );
};

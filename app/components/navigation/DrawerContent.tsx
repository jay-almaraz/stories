import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React, { ReactElement } from 'react';
import { Image, ImageRequireSource, View } from 'react-native';

export const DrawerContent: React.FC<DrawerContentComponentProps> = (props): ReactElement => {
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
    </DrawerContentScrollView>
  );
};

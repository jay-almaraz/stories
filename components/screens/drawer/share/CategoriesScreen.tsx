import { StackScreenProps } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { Button } from 'react-native-paper';

import { Screen } from '../../../core/Screen';
import { ShareStackRoutes } from './ShareMain';

type CategoriesScreenProps = StackScreenProps<ShareStackRoutes, 'categories'>;
export const CategoriesScreen: React.FC<CategoriesScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  return (
    <Screen title='Categories' drawerHelpers={navigation.dangerouslyGetParent()}>
      <Button onPress={() => navigation.push('record')}>RECORD</Button>
    </Screen>
  );
};

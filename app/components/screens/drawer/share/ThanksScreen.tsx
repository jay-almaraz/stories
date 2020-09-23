/**
 * Screen for thanking users who have shared their story
 */

import { StackScreenProps } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { BottomButtons } from '../../../core/BottomButtons';
import { Screen } from '../../../core/Screen';
import { ShareStackRoutes } from './ShareMain';

type ThanksScreenProps = StackScreenProps<ShareStackRoutes, 'share'>;
export const ThanksScreen: React.FC<ThanksScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  const theme = useTheme();

  return (
    <Screen title='Share' drawerHelpers={navigation.dangerouslyGetParent()}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Icon name='check-circle' size={128} color={theme.colors.primary} />
          <Text style={styles.topText}>THANKS FOR SHARING</Text>
        </View>
        <View style={styles.bottomContainer}>
          <BottomButtons
            buttons={[
              {
                disabled: false,
                onPress: () => navigation.navigate('categories'),
                mode: 'contained',
                label: 'SHARE ANOTHER',
              },
            ]}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
  },
  topContainer: {
    flex: 1,
    flexGrow: 6,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    fontSize: 24,
    textAlign: 'center',
  },
  bottomContainer: {
    flex: 1,
    flexGrow: 1,
  },
});

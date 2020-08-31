import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Screen } from '../../../core/Screen';
import { DrawerRoutes } from '../../../navigation/DrawerMain';

type HomeScreenProps = DrawerScreenProps<DrawerRoutes, 'home'>;
export const HomeScreen: React.FC<HomeScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  const theme = useTheme();

  return (
    <Screen title='Home' drawerHelpers={navigation}>
      <View style={styles.container}>
        <TouchableRipple
          style={[styles.button, styles.topButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('share')}
          underlayColor={theme.colors.primary}
          rippleColor={`${theme.colors.primary}33`}
        >
          <View style={styles.buttonContainer}>
            <Icon name='microphone' style={[styles.buttonIcon, { color: theme.colors.text }]} />
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>Share</Text>
          </View>
        </TouchableRipple>

        <TouchableRipple
          style={[styles.button, styles.topButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('listen')}
          underlayColor={theme.colors.primary}
          rippleColor={`${theme.colors.primary}33`}
        >
          <View style={styles.buttonContainer}>
            <Icon name='headphones' style={[styles.buttonIcon, { color: theme.colors.text }]} />
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>Listen</Text>
          </View>
        </TouchableRipple>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 5,
    width: '95%',
    margin: 10,
  },
  topButton: {
    marginBottom: 5,
  },
  bottomButton: {
    marginTop: 5,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 64,
  },
  buttonIcon: {
    fontSize: 128,
  },
});

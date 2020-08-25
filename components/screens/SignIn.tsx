import { Picker } from '@react-native-community/picker';
import { StackScreenProps } from '@react-navigation/stack';
import React, { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { RootStackRoutes } from '../../App';

type SignInScreenProps = StackScreenProps<RootStackRoutes, 'signIn'>;
export const SignInScreen: React.FC<SignInScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  const [cityName, setCityName] = useState('');
  const [shiftName, setShiftName] = useState('');

  return (
    <View style={styles.mainView}>
      <Picker selectedValue={cityName} onValueChange={(value) => setCityName(value as string)}>
        <Picker.Item value='Brisbane' label='Brisbane' />
        <Picker.Item value='Sydney' label='Sydney' />
        <Picker.Item value='Melbourne' label='Melbourne' />
      </Picker>
      <Picker selectedValue={shiftName} onValueChange={(value) => setShiftName(value as string)}>
        <Picker.Item value='Brisbane Shift' label='Brisbane Shift' />
        <Picker.Item value='Sydney Shift' label='Sydney Shift' />
        <Picker.Item value='Melbourne Shift' label='Melbourne Shift' />
      </Picker>
      <Button disabled={!cityName || !shiftName} onPress={() => navigation.push('drawer', { cityName, shiftName })}>
        SIGN IN
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
  },
});

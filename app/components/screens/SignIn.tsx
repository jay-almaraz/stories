/**
 * Page used to sign into the app, should be the default page
 */

import { Picker } from '@react-native-community/picker';
import { StackScreenProps } from '@react-navigation/stack';
import useAxios from 'axios-hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { Image, ImageRequireSource, StyleSheet, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import uuid from 'react-native-uuid';

import { RootStackRoutes } from '../../App';
import { BottomButtons } from '../core/BottomButtons';

interface LocationsRes {
  data: {
    service_locations: {
      name: string;
      city: {
        name: string;
      };
    }[];
  };
}

type SignInScreenProps = StackScreenProps<RootStackRoutes, 'signIn'>;
export const SignInScreen: React.FC<SignInScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  const [userName, setUserName] = useState('');
  const [cityName, setCityName] = useState('');
  const [shiftName, setShiftName] = useState('');

  const [getLocationsRequest] = useAxios<LocationsRes>(
    {
      url: 'https://api.orangesky.org.au/v2/external/service-locations/locations-app',
      method: 'GET',
    },
    {
      useCache: false,
    }
  );
  const cities = getLocationsRequest.loading
    ? []
    : Array.from(new Set(getLocationsRequest.data.data.service_locations.flatMap((sl) => sl.city.name))).sort((a, b) =>
        a.localeCompare(b)
      );
  const shifts = getLocationsRequest.loading
    ? []
    : getLocationsRequest.data.data.service_locations
        .filter((sl) => sl.city.name === cityName)
        .map((sl) => sl.name)
        .sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (getLocationsRequest.loading) return;
    setCityName(getLocationsRequest.data.data.service_locations[0].city.name);
    setShiftName(getLocationsRequest.data.data.service_locations[0].name);
  }, [getLocationsRequest]);

  return (
    <View style={styles.mainView}>
      <View
        style={{
          flex: 1,
          flexGrow: 2,
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
      <View style={{ flexGrow: 1 }}>
        <TextInput
          label='Your Name (Optional)'
          value={userName}
          onChangeText={(text) => setUserName(text)}
          mode='flat'
        />
        <HelperText type='info'>This name will show up on comments and stories you share</HelperText>
        <Picker
          style={{ marginTop: 10 }}
          selectedValue={cityName}
          onValueChange={(value) => setCityName(value as string)}
        >
          {cities.map((city) => (
            <Picker.Item key={city} value={city} label={city} />
          ))}
        </Picker>
        <Picker
          style={{ marginTop: 10 }}
          selectedValue={shiftName}
          onValueChange={(value) => setShiftName(value as string)}
        >
          {shifts.map((shift) => (
            <Picker.Item key={shift} value={shift} label={shift} />
          ))}
        </Picker>
      </View>
      <View style={styles.bottomContainer}>
        <BottomButtons
          buttons={[
            {
              disabled: false,
              onPress: () =>
                navigation.navigate('drawer', {
                  userName: userName ? userName : undefined,
                  sessionId: uuid.v4(),
                  cityName,
                  shiftName,
                }),
              mode: 'contained',
              label: 'SIGN IN',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  bottomContainer: {
    flex: 1,
    flexGrow: 1,
  },
});

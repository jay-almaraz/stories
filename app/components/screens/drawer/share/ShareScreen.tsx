import { Picker } from '@react-native-community/picker';
import { StackScreenProps } from '@react-navigation/stack';
import { AxiosError } from 'axios';
import useAxios from 'axios-hooks';
import { getType } from 'mime';
import React, { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import { useUserContext } from '../../../contexts/user/use-user-context';
import { BottomButtons } from '../../../core/BottomButtons';
import { Screen } from '../../../core/Screen';
import { Categories } from '../../../lookup/Categories';
import { ShareStackRoutes } from './ShareMain';

type ShareScreenProps = StackScreenProps<ShareStackRoutes, 'share'>;
export const ShareScreen: React.FC<ShareScreenProps> = (props): ReactElement => {
  const {
    navigation,
    route: { params },
  } = props;

  const [, runShareStoryRequest] = useAxios<unknown>(
    {
      url: 'http://192.168.0.16:6080/stories/share',
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
    {
      manual: true,
      useCache: false,
    }
  );

  const user = useUserContext();

  const [userName, setUserName] = useState(user.userName);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState(params.categoryName);

  return (
    <Screen title='Share' drawerHelpers={navigation.dangerouslyGetParent()}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topText}>{`Finalise Your Story About ${categoryName}`}</Text>
          <Text style={styles.topTextSubtitle}>{`Duration: ${params.recordingDuration}`}</Text>
          <Picker selectedValue={categoryName} onValueChange={(value) => setCategoryName(value as string)}>
            {Categories.map((x) => (
              <Picker.Item value={x.name} label={x.name} key={x.name} />
            ))}
          </Picker>
          <TextInput label='Title' value={title} onChangeText={(text) => setTitle(text)} mode='flat' />
          <TextInput
            label='Your Name (Optional)'
            value={userName}
            onChangeText={(text) => setUserName(text)}
            mode='flat'
          />
          <TextInput
            label='Description (Optional)'
            value={description}
            onChangeText={(text) => setDescription(text)}
            mode='flat'
            numberOfLines={10}
            multiline
          />
        </View>

        <View style={styles.bottomContainer}>
          <BottomButtons
            buttons={[
              {
                disabled: false,
                onPress: () => navigation.navigate('categories'),
                mode: 'outlined',
                label: 'CANCEL',
              },
              {
                disabled: !title,
                onPress: () => {
                  const formData = new FormData();
                  formData.append('title', title);
                  formData.append('categoryName', categoryName);
                  formData.append('cityName', user.cityName);
                  formData.append('shiftName', user.shiftName);
                  formData.append('recordingDuration', params.recordingDuration);
                  formData.append(
                    'recording',
                    {
                      uri: params.file.uri,
                      type: getType(params.file.uri) ?? 'video/3gpp',
                      name: params.file.uri.split('/').pop() ?? 'recording.3gp',
                    },
                    'RECORDING'
                  );

                  if (userName) formData.append('userName', userName);
                  if (description) formData.append('description', description);

                  console.log(params);
                  console.log(formData);

                  runShareStoryRequest({
                    data: formData,
                  })
                    .then((res) => {
                      if (res.status >= 200 && res.status < 300) {
                        console.log(res.data);
                        // navigation.navigate('thanks');
                        return;
                      }

                      console.error(`Unable to share story: ${res.status}`);
                    })
                    .catch((e: AxiosError) => console.error(`Unable to share story: ${e.message}`));
                },
                mode: 'contained',
                label: 'SUBMIT',
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
  },
  topText: {
    fontSize: 40,
    textAlign: 'center',
  },
  topTextSubtitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  bottomContainer: {
    flex: 1,
    flexGrow: 1,
  },
});

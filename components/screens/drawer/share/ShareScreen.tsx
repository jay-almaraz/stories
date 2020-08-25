import { Picker } from '@react-native-community/picker';
import { StackScreenProps } from '@react-navigation/stack';
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
                  fetch(params.file.uri).then((res) => {
                    const formData = new FormData();
                    res.blob().then((blob) => {
                      formData.append('title', title);
                      formData.append('categoryName', categoryName);
                      formData.append('file', blob, 'RECORDING');

                      if (userName) formData.append('userName', userName);
                      if (description) formData.append('description', description);

                      console.log(JSON.stringify(formData));
                      navigation.navigate('thanks');
                    });
                  });
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

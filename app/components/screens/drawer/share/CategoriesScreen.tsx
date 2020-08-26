import { StackScreenProps } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableHighlight, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Screen } from '../../../core/Screen';
import { Categories } from '../../../lookup/Categories';
import { ShareStackRoutes } from './ShareMain';

const { width: DEVICE_WIDTH } = Dimensions.get('window');

type CategoriesScreenProps = StackScreenProps<ShareStackRoutes, 'categories'>;
export const CategoriesScreen: React.FC<CategoriesScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  const theme = useTheme();

  return (
    <Screen title='Share' drawerHelpers={navigation.dangerouslyGetParent()}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          {Categories.map((category) => (
            <TouchableHighlight
              style={[styles.button, styles.topButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('record', { categoryName: category.name })}
              underlayColor={theme.colors.primary}
              activeOpacity={0.5}
              key={category.name}
            >
              <View style={styles.buttonContainer}>
                <Icon name={category.icon} style={[styles.buttonIcon, { color: theme.colors.text }]} />
                <Text style={[styles.buttonText, { color: theme.colors.text }]}>{category.name}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {},
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    minWidth: 0.4 * DEVICE_WIDTH,
    maxWidth: 0.4 * DEVICE_WIDTH,
    minHeight: 0.4 * DEVICE_WIDTH,
    maxHeight: 0.4 * DEVICE_WIDTH,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 5,
    marginVertical: 15,
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
    fontSize: 24,
  },
  buttonIcon: {
    fontSize: 64,
  },
});

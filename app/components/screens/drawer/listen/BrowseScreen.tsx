import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import useAxios from 'axios-hooks';
import React, { ReactElement, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

import { Screen } from '../../../core/Screen';
import { getCategory } from '../../../lookup/Categories';
import { API_URL } from '../../../network/network-config';
import { ListenStackRoutes } from './ListenMain';

export interface Story {
  id: string;
  date: string;
  title: string;
  name: string | null;
  description: string | null;
  category: string;
  city: string;
  shift: string;
  duration: string;
  url: string;
  approved: boolean;
  hearts: number;
}

type BrowseScreenProps = StackScreenProps<ListenStackRoutes, 'browse'>;
export const BrowseScreen: React.FC<BrowseScreenProps> = (props): ReactElement | null => {
  const { navigation } = props;

  const theme = useTheme();

  const [getStoriesRequest, runGetStoriesRequest] = useAxios<{ data: Story[] }>(
    {
      url: `${API_URL}/stories`,
      method: 'GET',
    },
    {
      useCache: false,
    }
  );

  useFocusEffect(
    useCallback(() => {
      runGetStoriesRequest();
    }, [runGetStoriesRequest])
  );

  return !getStoriesRequest.loading ? (
    <Screen title='Listen' drawerHelpers={navigation.dangerouslyGetParent()}>
      <ScrollView>
        {getStoriesRequest.data.data.map((story) => {
          const category = getCategory(story.category);

          return (
            <List.Item
              key={story.id}
              title={`${story.title} - ${story.city}, ${story.shift}`}
              description={story.description}
              left={(props) => <List.Icon {...props} icon={category.communityIcon} />}
              right={() =>
                story.hearts > 0 ? (
                  <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: theme.colors.primary, fontSize: 24, marginRight: -10, marginLeft: 10 }}>
                      {story.hearts}
                    </Text>
                    <List.Icon style={{ marginLeft: 0 }} icon='heart' color={theme.colors.primary} />
                  </View>
                ) : undefined
              }
              descriptionNumberOfLines={2}
              descriptionEllipsizeMode='tail'
              titleNumberOfLines={2}
              titleEllipsizeMode='tail'
              onPress={() => navigation.navigate('story', { storyId: story.id })}
            />
          );
        })}
      </ScrollView>
    </Screen>
  ) : null;
};

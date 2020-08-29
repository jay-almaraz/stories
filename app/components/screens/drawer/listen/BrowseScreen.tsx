import { StackScreenProps } from '@react-navigation/stack';
import useAxios from 'axios-hooks';
import React, { ReactElement } from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import { Screen } from '../../../core/Screen';
import { getCategory } from '../../../lookup/Categories';
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
}

type BrowseScreenProps = StackScreenProps<ListenStackRoutes, 'browse'>;
export const BrowseScreen: React.FC<BrowseScreenProps> = (props): ReactElement | null => {
  const { navigation } = props;

  const [getStoriesRequest] = useAxios<{ data: Story[] }>(
    {
      url: 'http://192.168.0.16:6080/stories',
      method: 'GET',
    },
    {
      useCache: false,
    }
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

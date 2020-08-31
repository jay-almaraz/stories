import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import useAxios from 'axios-hooks';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, List, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useUserContext } from '../../../contexts/user/use-user-context';
import { Screen } from '../../../core/Screen';
import { API_URL } from '../../../network/network-config';
import { Story } from './BrowseScreen';
import { ListenStackRoutes } from './ListenMain';

const { width: DEVICE_WIDTH } = Dimensions.get('window');

interface StoryWithComments extends Story {
  comments: {
    comment: string;
    datetime: string;
    name: string | null;
  }[];
}

type StoryScreenProps = StackScreenProps<ListenStackRoutes, 'story'>;
export const StoryScreen: React.FC<StoryScreenProps> = (props): ReactElement | null => {
  const {
    navigation,
    route: { params },
  } = props;

  const theme = useTheme();
  const user = useUserContext();

  const [isPlaybackAllowed, setIsPlaybackAllowed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [soundPosition, setSoundPosition] = useState<number | null>(null);
  const [soundDuration, setSoundDuration] = useState<number | null>(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldCorrectPitch, setShouldCorrectPitch] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [rate, setRate] = useState(1.0);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false);

  const [comments, setComments] = useState<StoryWithComments['comments']>([]);
  const [showDialog, setShowDialog] = useState<string | undefined>();
  const [comment, setComment] = useState('');

  const [getStoryRequest] = useAxios<{ data: StoryWithComments }>(
    {
      url: `${API_URL}/story/${params.storyId}`,
      method: 'GET',
    },
    {
      useCache: false,
    }
  );
  const story = getStoryRequest.loading ? undefined : getStoryRequest.data.data;

  useEffect(() => {
    setComments(story?.comments ?? []);
  }, [story]);

  const [addHeartRequest, runAddHeartRequest] = useAxios(
    {
      url: `${API_URL}/stories/add-heart`,
      method: 'POST',
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [deleteHeartRequest, runDeleteHeartRequest] = useAxios(
    {
      url: `${API_URL}/stories/delete-heart`,
      method: 'POST',
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const [addCommentRequest, runAddCommentRequest] = useAxios<{
    data: { comment: string; datetime: string; name: string };
  }>(
    {
      url: `${API_URL}/stories/add-comment`,
      method: 'POST',
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const updateScreenForSoundStatus = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setSoundDuration(status.durationMillis ?? null);
        setSoundPosition(status.positionMillis);
        setShouldPlay(status.shouldPlay);
        setIsPlaying(status.isPlaying);
        setRate(status.rate);
        setIsMuted(status.isMuted);
        setVolume(status.volume);
        setShouldCorrectPitch(status.shouldCorrectPitch);
        setIsPlaybackAllowed(true);
        return;
      }

      setSoundDuration(null);
      setSoundPosition(null);
      setIsPlaybackAllowed(false);

      if (status.error) {
        console.error(`FATAL PLAYER ERROR: ${status.error}`);
      }
    },
    [
      setSoundDuration,
      setSoundPosition,
      setShouldPlay,
      setIsPlaying,
      setRate,
      setIsMuted,
      setVolume,
      setShouldCorrectPitch,
      setIsPlaybackAllowed,
    ]
  );

  useEffect(() => {
    if (!story) {
      return () => {
        // Do nothing
      };
    }

    Audio.Sound.createAsync(
      {
        uri: story.url,
      },
      {
        isLooping: true,
        isMuted,
        volume,
        rate,
        shouldCorrectPitch,
      },
      updateScreenForSoundStatus
    ).then((value) => setSound(value.sound));
  }, [story, isMuted, volume, rate, shouldCorrectPitch, updateScreenForSoundStatus, setSound]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (sound)
          sound.pauseAsync().catch(() => {
            // Do nothing
          });
      };
    }, [sound])
  );

  const onPlayPausePressed = useCallback(() => {
    if (!sound) return;

    if (isPlaying) {
      sound.pauseAsync();
      return;
    }

    sound.playAsync();
  }, [sound, isPlaying]);

  const onSeekSliderValueChanged = useCallback(() => {
    if (!sound || isSeeking) return;

    setIsSeeking(true);
    setShouldPlayAtEndOfSeek(shouldPlay);
    sound.pauseAsync();
  }, [sound, isSeeking, setIsSeeking, setShouldPlayAtEndOfSeek, shouldPlay]);

  const onSeekSliderSlidingComplete = useCallback(
    (value: number) => {
      if (!sound) return;

      setIsSeeking(false);
      const seekPosition = value * (soundDuration || 0);

      if (shouldPlayAtEndOfSeek) {
        sound.playFromPositionAsync(seekPosition);
        return;
      }

      sound.setPositionAsync(seekPosition);
    },
    [sound, setIsSeeking, soundDuration, shouldPlayAtEndOfSeek]
  );

  const seekSliderPosition = useMemo(() => {
    if (sound && soundPosition !== null && soundDuration !== null) {
      return soundPosition / soundDuration;
    }

    return 0;
  }, [sound, soundPosition, soundDuration]);

  const getMMSSFromMillis = useCallback((millis: number) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number: number) => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }, []);

  const playbackTimestamp = useMemo(() => {
    if (sound && soundPosition !== null && soundDuration !== null) {
      return `${getMMSSFromMillis(soundPosition)} / ${getMMSSFromMillis(soundDuration)}`;
    }

    return '';
  }, [sound, soundPosition, soundDuration, getMMSSFromMillis]);

  const onHeartPressed = useCallback(
    (storyId: string) => {
      if (addHeartRequest.loading || deleteHeartRequest.loading) return;
      if (user.heartedStoryIds.includes(storyId)) {
        runDeleteHeartRequest({
          data: {
            storyId,
            sessionId: user.sessionId,
          },
        })
          .then(() => {
            user.removeHeartedStoryId(storyId);
          })
          .catch(() => console.error('Unable to remove heart'));
        return;
      }

      runAddHeartRequest({
        data: {
          storyId,
          sessionId: user.sessionId,
        },
      })
        .then(() => {
          user.addHeartedStoryId(storyId);
        })
        .catch(() => console.error('Unable to add heart'));
    },
    [addHeartRequest, deleteHeartRequest, runAddHeartRequest, runDeleteHeartRequest, user]
  );

  const addComment = useCallback(
    (storyId: string) => {
      if (addCommentRequest.loading) return;
      runAddCommentRequest({
        data: {
          storyId,
          sessionId: user.sessionId,
          comment,
        },
      })
        .then((res) => setComments((prevComments) => [...prevComments, res.data.data]))
        .catch(() => console.error('Unable to add comment'))
        .finally(() => {
          setComment('');
          setShowDialog(undefined);
        });
    },
    [addCommentRequest, runAddCommentRequest, user, comment]
  );

  return (
    <Screen title='Share' drawerHelpers={navigation.dangerouslyGetParent()}>
      {sound && story ? (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.topText}>{story.title}</Text>
            <View style={styles.playbackContainer}>
              <Slider
                style={styles.playbackSlider}
                value={seekSliderPosition}
                onValueChange={onSeekSliderValueChanged}
                onSlidingComplete={onSeekSliderSlidingComplete}
                thumbTintColor={theme.colors.primary}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.primary}
                disabled={!isPlaybackAllowed}
              />
              <Text style={[styles.playbackTimestamp, { fontFamily: 'sans-serif' }]}>{playbackTimestamp}</Text>
            </View>
          </View>
          <View style={styles.middleContainer}>
            <View style={{ ...styles.iconContainer, borderColor: theme.colors.primary }}>
              <Icon
                style={{ ...styles.roundIcon, color: theme.colors.primary }}
                name={isPlaying ? 'stop' : 'play'}
                onPress={onPlayPausePressed}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Icon
                style={{ ...styles.roundSubIcon, color: theme.colors.primary }}
                name={user.heartedStoryIds.includes(story.id) ? 'heart' : 'heart-o'}
                onPress={() => onHeartPressed(story.id)}
              />
            </View>
          </View>
          <ScrollView style={styles.bottomContainerScroll} contentContainerStyle={styles.bottomContainer}>
            <List.Section style={{ width: '100%' }}>
              {comments.map((comment, index) => (
                <List.Item
                  key={index}
                  description={comment.comment}
                  left={(props) => <List.Icon {...props} icon='comment' />}
                  title={`${comment.name ? `${comment.name} - ` : ''}${new Date(
                    `${comment.datetime.replace(' ', 'T')}Z`
                  ).toLocaleString()}`}
                  titleStyle={{ fontSize: 10 }}
                  descriptionNumberOfLines={100}
                />
              ))}
              <List.Item
                title='Add Comment'
                left={(props) => <List.Icon {...props} icon='plus' />}
                onPress={() => setShowDialog(story.id)}
              />
            </List.Section>
          </ScrollView>

          <Portal>
            <Dialog visible={Boolean(showDialog)} onDismiss={() => setShowDialog(undefined)}>
              <Dialog.Title>Add Comment</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  mode='outlined'
                  label='Comment'
                  placeholder='Type your comment here...'
                  value={comment}
                  onChangeText={(text) => setComment(text)}
                  multiline
                  numberOfLines={6}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    setComment('');
                    setShowDialog(undefined);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!comment}
                  mode='contained'
                  onPress={() => {
                    if (showDialog) addComment(showDialog);
                  }}
                >
                  Done
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  noPermissionsText: {
    textAlign: 'center',
  },
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
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 2,
    width: '100%',
  },
  topText: {
    fontSize: 40,
    textAlign: 'center',
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexGrow: 2,
    flexDirection: 'row',
    width: '100%',
    paddingTop: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 0.3 * DEVICE_WIDTH,
    width: 0.3 * DEVICE_WIDTH,
    borderStyle: 'solid',
    borderWidth: 5,
    borderRadius: 1000,
  },
  roundIcon: {
    textAlign: 'center',
    fontSize: 60,
  },
  roundSubIcon: {
    textAlign: 'center',
    fontSize: 40,
  },
  bottomContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bottomContainerScroll: {
    flex: 1,
    flexGrow: 3,
    width: '100%',
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: 30,
    minHeight: 10,
    maxHeight: 10,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  playbackTimestamp: {
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  commentsHeader: {
    fontSize: 30,
    alignSelf: 'center',
  },
});

import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import useAxios from 'axios-hooks';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Screen } from '../../../core/Screen';
import { Story } from './BrowseScreen';
import { ListenStackRoutes } from './ListenMain';

const { width: DEVICE_WIDTH } = Dimensions.get('window');

type StoryScreenProps = StackScreenProps<ListenStackRoutes, 'story'>;
export const StoryScreen: React.FC<StoryScreenProps> = (props): ReactElement | null => {
  const {
    navigation,
    route: { params },
  } = props;

  const theme = useTheme();

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

  const [getStoryRequest] = useAxios<{ data: Story }>(
    {
      url: `http://192.168.0.16:6080/story/${params.storyId}`,
      method: 'GET',
    },
    {
      useCache: false,
    }
  );
  const story = getStoryRequest.loading ? undefined : getStoryRequest.data.data;

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

  return (
    <Screen title='Share' drawerHelpers={navigation.dangerouslyGetParent()}>
      {sound && story ? (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.topText}>{`Review Your Story About ${story.category}`}</Text>
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
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 4,
    width: '100%',
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
  bottomContainer: {
    flex: 1,
    flexGrow: 1,
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
});

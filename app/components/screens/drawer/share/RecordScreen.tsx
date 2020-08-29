import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { FileInfo } from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { FileSystem } from 'react-native-unimodules';
import Icon from 'react-native-vector-icons/FontAwesome';

import { BottomButtons } from '../../../core/BottomButtons';
import { Screen } from '../../../core/Screen';
import { ShareStackRoutes } from './ShareMain';

const RECORDING_SETTINGS = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

const { width: DEVICE_WIDTH } = Dimensions.get('window');

type RecordScreenProps = StackScreenProps<ShareStackRoutes, 'record'>;
export const RecordScreen: React.FC<RecordScreenProps> = (props): ReactElement => {
  const {
    navigation,
    route: { params },
  } = props;

  const theme = useTheme();

  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaybackAllowed, setIsPlaybackAllowed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [soundPosition, setSoundPosition] = useState<number | null>(null);
  const [soundDuration, setSoundDuration] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number | null>(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [shouldCorrectPitch, setShouldCorrectPitch] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [rate, setRate] = useState(1.0);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false);

  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  useEffect(() => {
    Permissions.askAsync(Permissions.AUDIO_RECORDING)
      .then((res) => setHasPermissions(res.granted))
      .catch((e) => console.error('Unable to ask for permissions', e));
  }, []);

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

  const stopRecordingAndEnablePlayback = useCallback(async () => {
    setIsLoading(true);

    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    } catch (e) {
      console.error('Unable to unload recording', e);
    }

    const info = await FileSystem.getInfoAsync(recording.getURI() || '');
    setFileInfo(info);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

    const { sound } = await recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted,
        volume,
        rate,
        shouldCorrectPitch,
      },
      updateScreenForSoundStatus
    );
    setSound(sound);

    setIsLoading(false);
  }, [setSound, recording, isMuted, volume, rate, shouldCorrectPitch, updateScreenForSoundStatus]);

  const updateScreenForRecordingStatus = useCallback(
    (status: Audio.RecordingStatus) => {
      if (status.canRecord) {
        setIsRecording(status.isRecording);
        setRecordingDuration(status.durationMillis);
        return;
      }

      if (status.isDoneRecording) {
        setIsRecording(false);
        setRecordingDuration(status.durationMillis);

        if (!isLoading) {
          stopRecordingAndEnablePlayback();
        }
      }
    },
    [isLoading, stopRecordingAndEnablePlayback]
  );

  const stopPlaybackAndBeginRecording = useCallback(async () => {
    setIsLoading(true);

    if (sound) {
      await sound.unloadAsync();
      sound.setOnPlaybackStatusUpdate(null);
      setSound(null);
      setSoundDuration(null);
      setSoundPosition(null);
      setIsPlaybackAllowed(false);
      setFileInfo(null);
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

    if (recording) {
      recording.setOnRecordingStatusUpdate(null);
      setRecording(null);
    }

    const newRecording = new Audio.Recording();
    await newRecording.prepareToRecordAsync(RECORDING_SETTINGS);
    newRecording.setOnRecordingStatusUpdate(updateScreenForRecordingStatus);

    setRecording(newRecording);
    await newRecording.startAsync();

    setIsLoading(false);
  }, [sound, setSound, recording, setRecording, updateScreenForRecordingStatus]);

  const onRecordPressed = useCallback(() => {
    if (isRecording) {
      stopRecordingAndEnablePlayback();
      return;
    }

    stopPlaybackAndBeginRecording();
  }, [isRecording, stopRecordingAndEnablePlayback, stopPlaybackAndBeginRecording]);

  const onPlayPausePressed = useCallback(() => {
    if (!sound) return;

    if (isPlaying) {
      sound.pauseAsync();
      return;
    }

    sound.playAsync();
  }, [sound, isPlaying]);

  const onDiscardPressed = useCallback(async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    setSound(null);
    setSoundDuration(null);
    setSoundPosition(null);
    setIsPlaybackAllowed(false);
    setFileInfo(null);
  }, [sound, setSound]);

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

  const onSharePressed = useCallback(() => {
    if (!fileInfo || !recordingDuration) return;
    navigation.navigate('share', {
      file: fileInfo,
      recordingDuration: getMMSSFromMillis(recordingDuration),
      categoryName: params.categoryName,
    });
  }, [fileInfo, navigation, recordingDuration, params, getMMSSFromMillis]);

  const playbackTimestamp = useMemo(() => {
    if (sound && soundPosition !== null && soundDuration !== null) {
      return `${getMMSSFromMillis(soundPosition)} / ${getMMSSFromMillis(soundDuration)}`;
    }

    return '';
  }, [sound, soundPosition, soundDuration, getMMSSFromMillis]);

  const recordingTimestamp = useMemo(() => {
    if (recordingDuration) {
      return getMMSSFromMillis(recordingDuration);
    }

    return getMMSSFromMillis(0);
  }, [recordingDuration, getMMSSFromMillis]);

  if (!hasPermissions) {
    return (
      <View style={styles.container}>
        <View />
        <Text style={[styles.noPermissionsText, { fontFamily: 'sans-serif' }]}>
          You must enable audio recording permissions in order to use this app.
        </Text>
        <View />
      </View>
    );
  }

  return (
    <Screen title='Share' drawerHelpers={navigation.dangerouslyGetParent()}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          {sound ? (
            <>
              <Text style={styles.topText}>{`Review Your Story About ${params.categoryName}`}</Text>
              <View style={styles.playbackContainer}>
                <Slider
                  style={styles.playbackSlider}
                  value={seekSliderPosition}
                  onValueChange={onSeekSliderValueChanged}
                  onSlidingComplete={onSeekSliderSlidingComplete}
                  thumbTintColor={theme.colors.primary}
                  minimumTrackTintColor={theme.colors.primary}
                  maximumTrackTintColor={theme.colors.primary}
                  disabled={!isPlaybackAllowed || isLoading}
                />
                <Text style={[styles.playbackTimestamp, { fontFamily: 'sans-serif' }]}>{playbackTimestamp}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.topText}>{`Share Your Story About ${params.categoryName}`}</Text>
          )}
        </View>
        <View style={styles.middleContainer}>
          <View style={{ ...styles.iconContainer, borderColor: theme.colors.primary }}>
            {sound ? (
              <Icon
                style={{ ...styles.roundIcon, color: theme.colors.primary }}
                name={isPlaying ? 'stop' : 'play'}
                onPress={onPlayPausePressed}
              />
            ) : (
              <Icon
                style={{ ...styles.roundIcon, color: theme.colors.primary }}
                name={isRecording ? 'stop' : 'microphone'}
                onPress={onRecordPressed}
              />
            )}
          </View>
          {isRecording ? <Text>{recordingTimestamp}</Text> : null}
        </View>
        <View style={styles.bottomContainer}>
          <BottomButtons
            buttons={[
              {
                disabled: !sound,
                onPress: onDiscardPressed,
                mode: 'outlined',
                label: 'DISCARD',
              },
              {
                disabled: !fileInfo,
                onPress: onSharePressed,
                mode: 'contained',
                label: 'SHARE',
              },
            ]}
          />
        </View>
      </View>
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

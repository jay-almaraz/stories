import Slider from '@react-native-community/slider';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Audio, AVPlaybackStatus } from 'expo-av';
import Font, { FontSource } from 'expo-font';
import * as Permissions from 'expo-permissions';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { FileSystem } from 'react-native-unimodules';

import { RootNavigatorRoutes } from '../../App';
import * as Icons from '../assets/Icons';
import { Screen } from '../core/Screen';

const RECORDING_SETTINGS = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFF8ED';
const LIVE_COLOR = '#FF0000';
const DISABLED_OPACITY = 0.5;
const RATE_SCALE = 3.0;

type RecordScreenProps = DrawerScreenProps<RootNavigatorRoutes, 'record'>;
export const RecordScreen: React.FC<RecordScreenProps> = (props): ReactElement => {
  const { navigation } = props;

  const [fontLoaded, setFontLoaded] = useState(true);
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

  useEffect(() => {
    Permissions.askAsync(Permissions.AUDIO_RECORDING)
      .then((res) => setHasPermissions(res.granted))
      .catch((e) => console.log('Unable to ask for permissions', e));

    // Font.loadAsync({
    //   'sans-serif': require('../../assets/fonts/CutiveMono-Regular.ttf') as FontSource,
    // }).then(() => setFontLoaded(true));
  }, []);

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
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
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
    } catch (e) {
      // Do nothing
    }

    const info = await FileSystem.getInfoAsync(recording.getURI() || '');
    console.log(`FILE INFO: ${JSON.stringify(info)}`);

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

  const onStopPressed = useCallback(() => {
    if (sound) sound.stopAsync();
  }, [sound]);

  const onMutePressed = useCallback(() => {
    if (sound) sound.setIsMutedAsync(isMuted);
  }, [sound, isMuted]);

  const onVolumeSliderValueChange = useCallback(
    (value: number) => {
      if (sound) sound.setVolumeAsync(value);
    },
    [sound]
  );

  const trySetRate = useCallback(
    async (rate: number, shouldCorrectPitch: boolean) => {
      if (!sound) return;

      try {
        await sound.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
        // Can't change rate
      }
    },
    [sound]
  );

  const onRateSliderSlidingComplete = useCallback(
    (value: number) => {
      trySetRate(value * RATE_SCALE, shouldCorrectPitch);
    },
    [trySetRate, shouldCorrectPitch]
  );

  const onPitchCorrectionPressed = useCallback(() => {
    trySetRate(rate, !shouldCorrectPitch);
  }, [trySetRate, rate, shouldCorrectPitch]);

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

  const recordingTimestamp = useMemo(() => {
    if (recordingDuration) {
      return getMMSSFromMillis(recordingDuration);
    }

    return getMMSSFromMillis(0);
  }, [recordingDuration, getMMSSFromMillis]);

  if (!fontLoaded) {
    return <View style={styles.emptyContainer} />;
  }

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
    <Screen title='Record' drawerHelpers={navigation}>
      <View style={styles.container}>
        <View
          style={[
            styles.halfScreenContainer,
            {
              opacity: isLoading ? DISABLED_OPACITY : 1.0,
            },
          ]}
        >
          <View />
          <View style={styles.recordingContainer}>
            <View />
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={onRecordPressed}
              disabled={isLoading}
            >
              <Image style={styles.image} source={Icons.RECORD_BUTTON.module} />
            </TouchableHighlight>
            <View style={styles.recordingDataContainer}>
              <View />
              <Text style={[styles.liveText, { fontFamily: 'sans-serif' }]}>{isRecording ? 'LIVE' : ''}</Text>
              <View style={styles.recordingDataRowContainer}>
                <Image style={[styles.image, { opacity: isRecording ? 1.0 : 0.0 }]} source={Icons.RECORDING.module} />
                <Text style={[styles.recordingTimestamp, { fontFamily: 'sans-serif' }]}>{recordingTimestamp}</Text>
              </View>
              <View />
            </View>
            <View />
          </View>
          <View />
        </View>
        <View
          style={[
            styles.halfScreenContainer,
            {
              opacity: !isPlaybackAllowed || isLoading ? DISABLED_OPACITY : 1.0,
            },
          ]}
        >
          <View />
          <View style={styles.playbackContainer}>
            <Slider
              style={styles.playbackSlider}
              trackImage={Icons.TRACK_1.module}
              thumbImage={Icons.THUMB_1.module}
              value={seekSliderPosition}
              onValueChange={onSeekSliderValueChanged}
              onSlidingComplete={onSeekSliderSlidingComplete}
              disabled={!isPlaybackAllowed || isLoading}
            />
            <Text style={[styles.playbackTimestamp, { fontFamily: 'sans-serif' }]}>{playbackTimestamp}</Text>
          </View>
          <View style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow]}>
            <View style={styles.volumeContainer}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={onMutePressed}
                disabled={!isPlaybackAllowed || isLoading}
              >
                <Image
                  style={styles.image}
                  source={isMuted ? Icons.MUTED_BUTTON.module : Icons.UNMUTED_BUTTON.module}
                />
              </TouchableHighlight>
              <Slider
                style={styles.volumeSlider}
                trackImage={Icons.TRACK_1.module}
                thumbImage={Icons.THUMB_2.module}
                value={1}
                onValueChange={onVolumeSliderValueChange}
                disabled={!isPlaybackAllowed || isLoading}
              />
            </View>
            <View style={styles.playStopContainer}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={onPlayPausePressed}
                disabled={!isPlaybackAllowed || isLoading}
              >
                <Image style={styles.image} source={isPlaying ? Icons.PAUSE_BUTTON.module : Icons.PLAY_BUTTON.module} />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={onStopPressed}
                disabled={!isPlaybackAllowed || isLoading}
              >
                <Image style={styles.image} source={Icons.STOP_BUTTON.module} />
              </TouchableHighlight>
            </View>
            <View />
          </View>
          <View style={[styles.buttonsContainerBase, styles.buttonsContainerBottomRow]}>
            <Text style={styles.timestamp}>Rate:</Text>
            <Slider
              style={styles.rateSlider}
              trackImage={Icons.TRACK_1.module}
              thumbImage={Icons.THUMB_1.module}
              value={rate / RATE_SCALE}
              onSlidingComplete={onRateSliderSlidingComplete}
              disabled={!isPlaybackAllowed || isLoading}
            />
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={onPitchCorrectionPressed}
              disabled={!isPlaybackAllowed || isLoading}
            >
              <Text style={[{ fontFamily: 'sans-serif' }]}>PC: {shouldCorrectPitch ? 'yes' : 'no'}</Text>
            </TouchableHighlight>
          </View>
          <View />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
    minHeight: DEVICE_HEIGHT,
    maxHeight: DEVICE_HEIGHT,
  },
  noPermissionsText: {
    textAlign: 'center',
  },
  wrapper: {},
  halfScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: DEVICE_HEIGHT / 2.0,
    maxHeight: DEVICE_HEIGHT / 2.0,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: Icons.RECORD_BUTTON.height,
    maxHeight: Icons.RECORD_BUTTON.height,
  },
  recordingDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: Icons.RECORD_BUTTON.height,
    maxHeight: Icons.RECORD_BUTTON.height,
    minWidth: Icons.RECORD_BUTTON.width * 3.0,
    maxWidth: Icons.RECORD_BUTTON.width * 3.0,
  },
  recordingDataRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: Icons.RECORDING.height,
    maxHeight: Icons.RECORDING.height,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: Icons.THUMB_1.height * 2.0,
    maxHeight: Icons.THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  liveText: {
    color: LIVE_COLOR,
  },
  recordingTimestamp: {
    paddingLeft: 20,
  },
  playbackTimestamp: {
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  image: {
    backgroundColor: BACKGROUND_COLOR,
  },
  textButton: {
    backgroundColor: BACKGROUND_COLOR,
    padding: 10,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainerTopRow: {
    maxHeight: Icons.MUTED_BUTTON.height,
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  playStopContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
    maxWidth: ((Icons.PLAY_BUTTON.width + Icons.STOP_BUTTON.width) * 3.0) / 2.0,
  },
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0 - Icons.MUTED_BUTTON.width,
  },
  buttonsContainerBottomRow: {
    maxHeight: Icons.THUMB_1.height,
    alignSelf: 'stretch',
    paddingRight: 20,
    paddingLeft: 20,
  },
  timestamp: {
    fontFamily: 'sans-serif',
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
});

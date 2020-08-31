import Constants from 'expo-constants';
export const API_URL =
  Constants.manifest.releaseChannel === 'prod' ? 'http://45.77.237.8:6080' : 'http://192.168.0.16:6080';

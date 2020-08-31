import Constants from 'expo-constants';
export const API_URL = (Constants.manifest.extra as { apiUrl: string }).apiUrl;

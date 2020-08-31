export default {
  name: 'stories',
  slug: 'stories',
  version: '1.0.0',
  assetBundlePatterns: ['**/*'],
  extra: {
    apiUrl: process.env.NODE_ENV === 'production' ? 'http://45.77.237.8:6080' : 'http://192.168.0.16:6080',
  },
};

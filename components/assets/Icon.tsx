import { Asset } from 'expo-asset';
import { ImageURISource } from 'react-native';

export default class Icon {
  readonly module: ImageURISource;
  readonly width: number;
  readonly height: number;

  constructor(module: ImageURISource, width: number, height: number) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module as string).downloadAsync();
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

import type { KeyValueStore } from './KeyValueStore';

export class AsyncStorageKeyValueStore implements KeyValueStore {
  async getItem(key: string) {
    return AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  }
}

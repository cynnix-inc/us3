import * as SecureStore from 'expo-secure-store';

// Supabase expects a simple string-based storage interface.
export const SupabaseSecureStore = {
  async getItem(key: string): Promise<string | null> {
    try {
      return (await SecureStore.getItemAsync(key)) ?? null;
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

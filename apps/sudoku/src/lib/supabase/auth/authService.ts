import type { SupabaseClient } from '@supabase/supabase-js';

export type OAuthProvider = 'google' | 'apple';

export class AuthService {
  constructor(private readonly client: SupabaseClient) {}

  async signInWithMagicLink(email: string, redirectTo?: string) {
    return this.client.auth.signInWithOtp({
      email,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });
  }

  async startOAuthSignIn(provider: OAuthProvider, redirectTo?: string) {
    // In Expo/RN you typically open `data.url` via `expo-web-browser` and handle the deep link redirect.
    return this.client.auth.signInWithOAuth({
      provider,
      options: redirectTo ? { redirectTo } : undefined,
    });
  }

  async signOut() {
    return this.client.auth.signOut();
  }

  async getSession() {
    return this.client.auth.getSession();
  }
}

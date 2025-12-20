import { createSupabaseClient, getSupabaseEnv } from '../client';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({ mock: true })),
  };
});

describe('supabase client', () => {
  beforeEach(() => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('throws if env vars are missing', () => {
    expect(() => getSupabaseEnv()).toThrow(/EXPO_PUBLIC_SUPABASE_URL/i);
  });

  it('creates client with URL and anon key', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon';

    const env = getSupabaseEnv();
    const client = createSupabaseClient(env);

    expect(client).toEqual({ mock: true });

    const mockedCreateClient = createClient as jest.MockedFunction<typeof createClient>;
    expect(mockedCreateClient).toHaveBeenCalledWith(env.url, env.anonKey, expect.any(Object));
  });
});

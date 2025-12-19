import { AuthService } from '../auth/authService';

describe('AuthService', () => {
  it('starts OAuth sign-in with redirect', async () => {
    const client: any = {
      auth: {
        signInWithOAuth: jest.fn(async () => ({
          data: { url: 'https://oauth' },
          error: null,
        })),
      },
    };

    const svc = new AuthService(client);
    await svc.startOAuthSignIn('google', 'sudoku://auth/callback');

    expect(client.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: 'sudoku://auth/callback' },
    });
  });

  it('sends magic link', async () => {
    const client: any = {
      auth: {
        signInWithOtp: jest.fn(async () => ({ data: {}, error: null })),
      },
    };

    const svc = new AuthService(client);
    await svc.signInWithMagicLink('test@example.com', 'https://example.com');

    expect(client.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      options: { emailRedirectTo: 'https://example.com' },
    });
  });
});

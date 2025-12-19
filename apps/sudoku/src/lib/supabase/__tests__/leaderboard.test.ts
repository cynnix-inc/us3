import { LeaderboardService } from '../leaderboard';

describe('LeaderboardService', () => {
  it('invokes submit-daily-run function', async () => {
    const client: any = {
      functions: {
        invoke: jest.fn(async () => ({ data: { ok: true }, error: null })),
      },
    };

    const svc = new LeaderboardService(client);
    await svc.submitDailyRun({
      dateISO: '2025-12-19',
      puzzleId: 'daily:2025-12-19',
      elapsedMs: 1234,
      assisted: false,
      competitiveEligible: true,
    });

    expect(client.functions.invoke).toHaveBeenCalledWith('submit-daily-run', {
      body: {
        dateISO: '2025-12-19',
        puzzleId: 'daily:2025-12-19',
        elapsedMs: 1234,
        assisted: false,
        competitiveEligible: true,
      },
    });
  });
});

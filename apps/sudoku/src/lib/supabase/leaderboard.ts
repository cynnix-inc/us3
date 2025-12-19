import type { SupabaseClient } from '@supabase/supabase-js';

export type SubmitDailyRunInput = {
  dateISO: string;
  puzzleId: string;
  elapsedMs: number;
  assisted: boolean;
  competitiveEligible: boolean;
};

export class LeaderboardService {
  constructor(private readonly client: SupabaseClient) {}

  async submitDailyRun(input: SubmitDailyRunInput) {
    // Edge Function should validate puzzle identity/date and sanity-check time.
    return this.client.functions.invoke('submit-daily-run', { body: input });
  }
}

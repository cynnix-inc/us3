// Supabase Edge Function (Deno) skeleton.
// Validates daily leaderboard submissions at a basic level (v1: medium anti-cheat).

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type SubmitDailyRunInput = {
  dateISO: string;
  puzzleId: string;
  elapsedMs: number;
  assisted: boolean;
  competitiveEligible: boolean;
};

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { 'content-type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body: SubmitDailyRunInput;
  try {
    body = (await req.json()) as SubmitDailyRunInput;
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (!body?.dateISO || !body?.puzzleId) return badRequest('Missing dateISO or puzzleId');
  if (
    typeof body.elapsedMs !== 'number' ||
    !Number.isFinite(body.elapsedMs) ||
    body.elapsedMs < 0
  ) {
    return badRequest('Invalid elapsedMs');
  }

  // Basic sanity check: reject implausible times (> 6 hours).
  if (body.elapsedMs > 6 * 60 * 60 * 1000) {
    return badRequest('Elapsed time is not plausible');
  }

  // TODO(v1):
  // - Validate puzzleId matches the deterministic daily puzzle for dateISO
  // - Verify user is authenticated; enforce RLS/table writes
  // - Insert into leaderboard table with unique constraint (dateISO, userId)
  // - Apply penalties/rejection if assisted or not competitiveEligible

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
});

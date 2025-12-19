import type { SupabaseClient } from '@supabase/supabase-js';

// Local-first sync scaffolding (v1):
// - Settings
// - In-progress puzzle state
// - Runs/history
// - Favorites
// Conflicts: last-write-wins (PRD)

export class SyncService {
  constructor(private readonly client: SupabaseClient) {}

  /**
   * Pulls remote changes and applies them locally.
   * Implementation will depend on the local SQLite schema and remote tables.
   */
  async pull(): Promise<void> {
    // TODO: implement.
  }

  /**
   * Pushes local changes to Supabase.
   */
  async push(): Promise<void> {
    // TODO: implement.
  }
}

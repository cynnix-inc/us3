import type { SupabaseClient } from '@supabase/supabase-js';

// Local-first sync scaffolding (v1):
// - Settings
// - In-progress puzzle state
// - Runs/history
// - Favorites
// Conflicts: last-write-wins (PRD)

export class SyncService {
  // Intentionally unused in v1 scaffolding; will be used once remote tables are finalized.
  constructor(private readonly _client: SupabaseClient) {}

  /**
   * Pulls remote changes and applies them locally.
   * Implementation will depend on the local SQLite schema and remote tables.
   */
  async pull(): Promise<void> {
    // Not implemented yet: pending finalized local schema + remote tables.
  }

  /**
   * Pushes local changes to Supabase.
   */
  async push(): Promise<void> {
    // Not implemented yet: pending finalized local schema + remote tables.
  }
}

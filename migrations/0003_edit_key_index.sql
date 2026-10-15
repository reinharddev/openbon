-- Lets the Manage page find a campaign from its edit key.
CREATE INDEX IF NOT EXISTS idx_campaigns_edit_key_hash ON campaigns (edit_key_hash);

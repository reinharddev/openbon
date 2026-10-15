CREATE TABLE campaigns (
	id TEXT PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	visibility TEXT NOT NULL DEFAULT 'unlisted' CHECK (visibility IN ('public', 'unlisted')),
	edit_key_hash TEXT NOT NULL,
	uses INTEGER NOT NULL DEFAULT 0,
	report_count INTEGER NOT NULL DEFAULT 0,
	hidden INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL
);

CREATE INDEX idx_campaigns_listing ON campaigns (visibility, hidden, created_at DESC);

CREATE TABLE frames (
	id TEXT PRIMARY KEY,
	campaign_id TEXT NOT NULL REFERENCES campaigns (id) ON DELETE CASCADE,
	r2_key TEXT NOT NULL,
	width INTEGER NOT NULL,
	height INTEGER NOT NULL,
	position INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_frames_campaign ON frames (campaign_id, position);

CREATE TABLE reports (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	campaign_id TEXT NOT NULL REFERENCES campaigns (id) ON DELETE CASCADE,
	reason TEXT NOT NULL DEFAULT '',
	created_at INTEGER NOT NULL
);

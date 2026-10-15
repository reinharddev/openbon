-- Optional caption template with [Placeholder] fields that participants fill in.
ALTER TABLE campaigns ADD COLUMN caption TEXT NOT NULL DEFAULT '';

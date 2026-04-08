-- Seed marker used for idempotent inserts and targeted cleanup.
-- Do not change unless you also update cleanup-seed.sql.
INSERT INTO items (name, description)
VALUES
  ('First Item', 'Welcome to your app! This item was created as seed data. [seed:app-demo]'),
  ('Second Item', 'Another example item to get you started. [seed:app-demo]')
ON CONFLICT DO NOTHING;

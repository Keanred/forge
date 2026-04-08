-- Remove only demo records created by seed.sql.
DELETE FROM items WHERE description LIKE '%[seed:app-demo]%';

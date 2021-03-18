ALTER TABLE mytable ADD COLUMN height_in numeric GENERATED ALWAYS AS (height_cm / 2.54) STORED;

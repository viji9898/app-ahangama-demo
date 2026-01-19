-- Migration to add start_date field to purchases table
ALTER TABLE purchases ADD COLUMN start_date timestamp;

-- Update existing records to set start_date equal to purchase_date
UPDATE purchases SET start_date = purchase_date WHERE start_date IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE purchases ALTER COLUMN start_date SET NOT NULL;
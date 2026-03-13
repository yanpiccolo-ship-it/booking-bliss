
-- Add voice booking fields to reservations
ALTER TABLE public.reservations 
  ADD COLUMN IF NOT EXISTS language_code VARCHAR(5) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS raw_transcript TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'web';

-- Enable realtime for reservations
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;

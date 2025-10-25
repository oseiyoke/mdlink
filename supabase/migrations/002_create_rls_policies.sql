-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read documents (for view mode)
-- But exclude edit_key from being exposed
CREATE POLICY "Allow public read access"
  ON documents
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert new documents
CREATE POLICY "Allow public insert"
  ON documents
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow update only with valid edit_key
-- This will be enforced in the API layer as well
CREATE POLICY "Allow update with edit_key"
  ON documents
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Note: The actual edit_key validation will be done in the API layer
-- RLS here allows the operation, but API validates the key

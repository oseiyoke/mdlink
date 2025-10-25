-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(doc_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE documents
  SET view_count = view_count + 1
  WHERE id = doc_id;
END;
$$;

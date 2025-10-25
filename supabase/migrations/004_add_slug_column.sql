-- Add slug column to documents table
ALTER TABLE documents ADD COLUMN slug TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_documents_slug ON documents(slug);

-- Function to generate URL-safe slug from title with random suffix
CREATE OR REPLACE FUNCTION generate_slug(title TEXT) RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  random_suffix TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert title to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- If slug is empty, use 'document'
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'document';
  END IF;
  
  -- Limit base slug to 50 characters
  IF length(base_slug) > 50 THEN
    base_slug := substring(base_slug, 1, 50);
    base_slug := trim(both '-' from base_slug);
  END IF;
  
  -- Generate random 4-character suffix
  random_suffix := substring(md5(random()::text || clock_timestamp()::text), 1, 4);
  
  -- Combine base slug with random suffix
  final_slug := base_slug || '-' || random_suffix;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Backfill existing documents with slugs
UPDATE documents 
SET slug = generate_slug(title)
WHERE slug IS NULL;

-- Make slug NOT NULL and UNIQUE after backfilling
ALTER TABLE documents ALTER COLUMN slug SET NOT NULL;
ALTER TABLE documents ADD CONSTRAINT documents_slug_unique UNIQUE (slug);


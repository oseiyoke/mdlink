# Supabase Setup

## Database Setup Instructions

1. Create a new Supabase project at https://supabase.com

2. Run the migrations in order:
   - Go to SQL Editor in your Supabase dashboard
   - Execute `001_create_documents_table.sql`
   - Execute `002_create_rls_policies.sql`

3. Get your credentials:
   - Go to Project Settings > API
   - Copy the `Project URL` and set it as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the `anon/public` key and set it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the `service_role` key and set it as `SUPABASE_SERVICE_ROLE_KEY`

4. Update `.env.local` with your credentials

## Testing the Database

You can test the setup by running this SQL query:

```sql
-- Insert a test document
INSERT INTO documents (edit_key, title, content)
VALUES ('test-key-123', 'Test Document', '# Hello World');

-- Query the document
SELECT id, title, content, created_at FROM documents;

-- Clean up
DELETE FROM documents WHERE edit_key = 'test-key-123';
```

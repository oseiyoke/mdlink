# MDLink - Markdown Editor Mini App

A lightweight web application for creating, editing, and sharing markdown documents with real-time preview and collaborative editing capabilities.

## Features

- **Split View Editor**: Side-by-side markdown editing and live preview
- **Real-time Preview**: Instant rendering of markdown as HTML
- **Document Sharing**: Share documents via view-only or editable links
- **Auto-save**: Automatic saving every 30 seconds
- **No Account Required**: Create and edit documents without signing up
- **Secure Edit Links**: Edit access controlled by cryptographically secure keys
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI Library**: Ant Design 5
- **Database**: Supabase (PostgreSQL)
- **Markdown**: react-markdown with GFM and sanitization
- **Editor**: @uiw/react-textarea-code-editor

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works fine)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mdlink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at https://supabase.com

   b. Run the database migrations:
      - Go to SQL Editor in your Supabase dashboard
      - Execute the migrations in `supabase/migrations/` in order:
        - `001_create_documents_table.sql`
        - `002_create_rls_policies.sql`

   c. Get your credentials from Project Settings > API:
      - Project URL
      - anon/public key
      - service_role key

4. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to http://localhost:3000

## Usage

### Creating a Document

1. Click "Create New Document" on the homepage
2. Start typing markdown in the left panel
3. See the live preview on the right panel
4. Click "Save" or wait 30 seconds for auto-save

### Sharing Documents

1. Click the "Share" button in the document header
2. Copy the **View Link** for read-only access
3. Copy the **Edit Link** to allow editing (keep it private!)

### Editing a Shared Document

1. Open an edit link (contains `?key=...`)
2. Make your changes
3. Save manually or wait for auto-save

### Viewing a Document

1. Open a view link
2. See the rendered markdown
3. Click "Share" to get links

## Project Structure

```
mdlink/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   └── documents/        # Document CRUD endpoints
│   ├── edit/[id]/           # Edit mode page
│   ├── view/[id]/           # View-only page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── MarkdownEditor.tsx   # Code editor
│   ├── MarkdownPreview.tsx  # Markdown renderer
│   ├── DocumentHeader.tsx   # Header with save/share
│   └── ShareModal.tsx       # Share links dialog
├── lib/                     # Utilities and configs
│   ├── supabase/           # Supabase clients
│   └── utils/              # Helper functions
├── types/                   # TypeScript type definitions
├── supabase/               # Database migrations
└── public/                 # Static assets
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents` | Create new document |
| GET | `/api/documents/[id]` | Get document (public) |
| PUT | `/api/documents/[id]` | Update document (requires edit_key) |
| POST | `/api/documents/[id]/validate` | Validate edit key |

## Security Features

- **Edit Key Protection**: 32-byte cryptographically secure random keys
- **Server-side Validation**: All edit operations validate keys server-side
- **Content Sanitization**: HTML output is sanitized to prevent XSS
- **Rate Limiting**:
  - 10 documents per hour per IP
  - 60 saves per minute per document
- **Size Limits**: Maximum 100KB per document

## Database Schema

```sql
documents (
  id UUID PRIMARY KEY,
  title TEXT,
  content TEXT,
  edit_key TEXT UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  view_count INTEGER
)
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Deployment

This app can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any platform supporting Next.js

Make sure to set environment variables in your deployment platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues and questions, please open an issue on GitHub.

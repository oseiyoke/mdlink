# Product Requirements Document: Markdown Editor Mini App

## 1. Overview

A lightweight web application for creating, editing, and sharing markdown documents with real-time preview and collaborative editing capabilities.

## 2. Core Features

### 2.1 Editor Interface
- **Split View Layout**: Editor panel (left) and live preview panel (right)
- **Markdown Editing**: Syntax highlighting and basic markdown support
- **Real-time Preview**: Instant rendering of markdown as HTML
- **Responsive Design**: Adapts to different screen sizes

### 2.2 Document Management
- **Create Document**: Generate new markdown document with unique ID
- **Save Document**: Persist changes to Supabase
- **Auto-save**: Optional periodic saving (every 30 seconds when changes detected)
- **Document Title**: Editable document name

### 2.3 Sharing System
- **View Link**: Read-only access to rendered markdown
  - Format: `https://app.com/view/{documentId}`
- **Edit Link**: Allows editing with key validation
  - Format: `https://app.com/edit/{documentId}?key={editKey}`
- **Copy Link Buttons**: Easy one-click copy for both link types

## 3. User Flows

### 3.1 Create New Document
1. User lands on homepage
2. Clicks "New Document" or automatically starts with blank doc
3. Types markdown in editor
4. Document auto-saves or user clicks "Save"
5. Document ID and edit key generated
6. Share links become available

### 3.2 Edit Existing Document
1. User receives edit link with valid key
2. System validates edit key against document
3. If valid: Full editor access granted
4. If invalid: Redirect to view-only mode or show error

### 3.3 View Document
1. User opens view link
2. System displays rendered markdown (preview only)
3. No editing interface shown
4. Optional "Request Edit Access" button

## 4. Technical Requirements

### 4.1 Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Ant Design (antd) components
- **Markdown Parser**: `react-markdown` or `marked`
- **Code Editor**: `@uiw/react-textarea-code-editor` or `react-simple-code-editor`
- **Key Ant Design Components**:
  - `Layout` (Sider, Content) for split view
  - `Input.TextArea` or custom editor wrapper
  - `Button` for save/copy actions
  - `Typography` for preview rendering
  - `message` for notifications
  - `Modal` for share dialogs
  - `Spin` for loading states

**Key Dependencies:**
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "antd": "^5.0.0",
  "react-markdown": "^9.0.0",
  "@supabase/supabase-js": "^2.38.0"
}
```

### 4.2 Routing Structure (Next.js App Router)
- `/` - Homepage (create new document or redirect to new doc)
- `/edit/[id]` - Edit mode page (validates edit_key from query params)
- `/view/[id]` - View-only mode page

### 4.3 Backend/Database (Supabase)
- Real-time subscriptions for collaborative editing (optional)
- Row Level Security (RLS) policies for access control
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

### 4.4 Data Model

**Documents Table** (`documents`)
```sql
- id (uuid, primary key)
- title (text, default: "Untitled Document")
- content (text)
- edit_key (text, unique, indexed)
- created_at (timestamp)
- updated_at (timestamp)
- view_count (integer, default: 0)
```

**Indexes**
- `edit_key` (for fast validation)
- `created_at` (for sorting/cleanup)

## 5. Security Considerations

### 5.1 Edit Key
- Generate cryptographically secure random string (32+ characters)
- Never expose edit key in view-only mode
- Validate key server-side before allowing edits

### 5.2 Rate Limiting
- Limit document creation per IP (e.g., 10/hour)
- Limit save operations per document (e.g., 60/minute)

### 5.3 Content Validation
- Sanitize rendered HTML to prevent XSS
- Limit document size (e.g., 100KB max)

## 6. API Endpoints (Next.js API Routes)

```
POST   /api/documents              - Create new document
GET    /api/documents/[id]         - Get document (public)
PUT    /api/documents/[id]         - Update document (requires valid edit_key)
POST   /api/documents/[id]/validate - Validate edit key
```

**Next.js Route Structure:**
- `/app/api/documents/route.ts` - Handle POST for creating documents
- `/app/api/documents/[id]/route.ts` - Handle GET and PUT for specific document
- `/app/api/documents/[id]/validate/route.ts` - Handle edit key validation

## 7. MVP Scope

**In Scope:**
- Basic markdown editing and preview
- Save/load documents
- Share view and edit links
- Key-based edit authentication

**Out of Scope (Future):**
- User accounts/authentication
- Document version history
- Real-time collaborative editing
- Document folders/organization
- Export to PDF/other formats
- Custom themes

## 8. Success Metrics

- Documents created per day
- Edit link usage rate
- Average document size
- Share link click-through rate



import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { rateLimiter } from '@/lib/utils/rateLimiter';
import {
  validateContentSize,
  validateTitle,
  validateEditKey,
  getClientIp,
} from '@/lib/utils/validation';
import { Database } from '@/types/database';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/documents/[id] - Fetch document (public, excludes edit_key)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Fetch document from database
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('id, title, content, created_at, updated_at, view_count')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // TODO: Increment view count
    // Note: Skipped due to TypeScript typing issues with Supabase
    // Can be added later with proper database function or type casting

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document (requires valid edit_key)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Rate limiting: 60 updates per minute
    const clientIp = getClientIp(request);
    const isRateLimited = rateLimiter.check(`${clientIp}:${id}`, 60, 60 * 1000);

    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, content, edit_key } = body;

    // Validate edit key
    const editKeyValidation = validateEditKey(edit_key);
    if (!editKeyValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid or missing edit key' },
        { status: 401 }
      );
    }

    // Verify edit key matches document
    const { data: document, error: fetchError } = await supabaseAdmin
      .from('documents')
      .select('edit_key')
      .eq('id', id)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Type assertion for document
    const doc = document as { edit_key: string };

    if (doc.edit_key !== edit_key) {
      return NextResponse.json(
        { error: 'Invalid edit key' },
        { status: 403 }
      );
    }

    // Build update object
    const updates: Database['public']['Tables']['documents']['Update'] = {};

    if (title !== undefined) {
      const titleValidation = validateTitle(title);
      if (!titleValidation.valid) {
        return NextResponse.json(
          { error: titleValidation.error },
          { status: 400 }
        );
      }
      updates.title = title;
    }

    if (content !== undefined) {
      const contentValidation = validateContentSize(content);
      if (!contentValidation.valid) {
        return NextResponse.json(
          { error: contentValidation.error },
          { status: 400 }
        );
      }
      updates.content = content;
    }

    // Update document
    const { data, error } = await supabaseAdmin
      .from('documents')
      .update(updates as any)
      .eq('id', id)
      .select('id, title, content, updated_at')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update document' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

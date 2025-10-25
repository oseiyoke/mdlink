import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateEditKey } from '@/lib/utils/generateEditKey';
import { generateSlug } from '@/lib/utils/generateSlug';
import { rateLimiter } from '@/lib/utils/rateLimiter';
import { validateContentSize, validateTitle, getClientIp } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 documents per hour
    const clientIp = getClientIp(request);
    const isRateLimited = rateLimiter.check(clientIp, 10, 60 * 60 * 1000);

    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title = 'Untitled Document', content = '' } = body;

    // Validate input
    const titleValidation = validateTitle(title);
    if (!titleValidation.valid) {
      return NextResponse.json(
        { error: titleValidation.error },
        { status: 400 }
      );
    }

    const contentValidation = validateContentSize(content);
    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 }
      );
    }

    // Generate edit key and slug
    const editKey = generateEditKey();
    const slug = generateSlug(title);

    // Create document in database
    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert({
        title,
        content,
        edit_key: editKey,
        slug,
      })
      .select('id, slug')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create document' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      slug: data.slug,
      edit_key: editKey,
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

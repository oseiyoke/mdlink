import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateEditKey } from '@/lib/utils/validation';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/documents/[id]/validate - Validate edit key
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { edit_key } = body;

    // Validate edit key format
    const editKeyValidation = validateEditKey(edit_key);
    if (!editKeyValidation.valid) {
      return NextResponse.json({ valid: false });
    }

    // Check if edit key matches document
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('edit_key')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ valid: false });
    }

    const valid = data.edit_key === edit_key;
    return NextResponse.json({ valid });
  } catch (error) {
    console.error('Error validating edit key:', error);
    return NextResponse.json({ valid: false });
  }
}

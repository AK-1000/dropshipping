import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { QueryOptimizer } from '@/lib/db/queryOptimizer'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const optimizer = new QueryOptimizer(supabase)
  
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '20'
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'created_at'
  const order = searchParams.get('order') || 'desc'

  try {
    const filters: any = { status: 'active' }
    if (category) filters.category_id = category

    const result = await optimizer.paginatedFetch('products', {
      pageSize: parseInt(limit),
      filters,
      orderBy: { column: sort, ascending: order === 'asc' }
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
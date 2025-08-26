import {NextRequest, NextResponse } from 'next/server';
import {createServerSupabaseClient} from '../../../lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const body = await request.json()

  try {
    // Start a transaction-like operation
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...body,
        order_number: `ORD-${Date.now()}`,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = body.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      vendor_id: item.vendorId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
      variant: item.variant
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      // Rollback by deleting the order
      await supabase.from('orders').delete().eq('id', order.id)
      throw itemsError
    }

    // Update product quantities
    for (const item of body.items) {
      await supabase.rpc('decrement_product_quantity', {
        product_id: item.productId,
        quantity: item.quantity
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
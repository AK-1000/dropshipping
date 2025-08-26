import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { QueryOptimizer } from '@/lib/db/queryOptimizer'

const supabase = createClient()
const optimizer = new QueryOptimizer(supabase)

export function useProducts(options?: {
  category?: string
  featured?: boolean
  limit?: number
}) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          vendor:vendors(business_name)
        `)
        .eq('status', 'active')

      if (options?.category) {
        query = query.eq('category_id', options.category)
      }

      if (options?.featured) {
        query = query.eq('featured', true)
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          vendor:vendors(business_name),
          reviews(rating, comment, user:profiles(full_name))
        `)
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!slug,
  })
}

export function useProductSearch(searchTerm: string) {
  return useQuery({
    queryKey: ['products', 'search', searchTerm],
    queryFn: () => optimizer.debouncedSearch(
      'products',
      searchTerm,
      ['name', 'description'],
      300
    ),
    enabled: searchTerm.length > 2,
  })
}